import * as Sentry from "@sentry/node"
import yaml from "js-yaml"
import superagent from "superagent"
import User from "../models/user"
import { fileUrl } from "../datalad/files"
import { commitFiles } from "../datalad/dataset"
import { getDatasetWorker } from "../libs/datalad-service"
import type {
  Contributor,
  RawDataciteContributor,
  RawDataciteYml,
} from "../types/datacite"
import { validateOrcid } from "../utils/orcid-utils"
import { description as getDescription } from "../datalad/description"

/**
 * Returns a minimal datacite.yml structure
 */
export const emptyDataciteYml = async (
  obj?: { datasetId: string; revision?: string },
): Promise<RawDataciteYml> => {
  let fallbackDescription = "N/A"

  if (obj?.datasetId) {
    try {
      const descObj = await getDescription(obj)
      if (descObj?.Description) {
        fallbackDescription = descObj.Description
      }
    } catch (_err) {
      // fallback remains "No description provided"
    }
  }

  return {
    data: {
      attributes: {
        types: { resourceTypeGeneral: "Dataset" },
        contributors: [],
        creators: [],
        descriptions: [
          {
            description: fallbackDescription,
            descriptionType: "Abstract",
          },
        ],
      },
    },
  }
}

/**
 * Fetch datacite.yml for a dataset revision
 */
export const getDataciteYml = async (
  datasetId: string,
  revision?: string,
): Promise<RawDataciteYml> => {
  const dataciteFileUrl = fileUrl(datasetId, "", "datacite", revision)

  try {
    const res = await fetch(dataciteFileUrl)

    if (res.status === 200) {
      const text = await res.text()
      const parsed: RawDataciteYml = yaml.load(text) as RawDataciteYml

      // Add fallback if no descriptions exist
      if (
        !parsed.data.attributes.descriptions ||
        parsed.data.attributes.descriptions.length === 0
      ) {
        const descObj = await getDescription({ datasetId, revision })
        const fallbackDescription = descObj?.Description ||
          "No description provided"

        parsed.data.attributes.descriptions = [
          {
            description: fallbackDescription,
            descriptionType: "Abstract",
          },
        ]
      }

      return parsed
    }

    // If datacite.yml missing (404), create from dataset_description
    if (res.status === 404) {
      return await emptyDataciteYml({ datasetId, revision })
    }

    throw new Error(
      `Unexpected status ${res.status} when fetching datacite.yml`,
    )
  } catch (err) {
    Sentry.captureException(err)
    // Even if fetch fails, still try to build from dataset_description
    return await emptyDataciteYml({ datasetId, revision })
  }
}

/**
 * Save datacite.yml back to dataset
 */
export const saveDataciteYmlToRepo = async (
  datasetId: string,
  cookies: string,
  dataciteData: RawDataciteYml,
) => {
  const url = `${
    getDatasetWorker(datasetId)
  }/datasets/${datasetId}/files/datacite.yml`

  try {
    // Directly PUT the file using the user's request cookies
    await superagent
      .post(url)
      .set("Cookie", cookies)
      .set("Accept", "application/json")
      .set("Content-Type", "text/yaml")
      .send(yaml.dump(dataciteData))

    // Commit the draft after upload
    const gitRef = await commitFiles(datasetId, cookies)
    return { id: gitRef }
  } catch (err) {
    Sentry.captureException(err)
    throw err
  }
}

/**
 * Converts RawDataciteContributor -> internal Contributor type.
 * Optionally attaches a `userId` if the contributor exists as a site user.
 */
export const normalizeRawContributors = async (
  raw: RawDataciteContributor[] | undefined,
): Promise<Contributor[]> => {
  if (!Array.isArray(raw)) return []

  const orcids = raw
    .map((c) => validateOrcid(c.nameIdentifiers?.[0]?.nameIdentifier))
    .filter(Boolean) as string[]

  const users = await User.find({ orcid: { $in: orcids } }).exec()
  const orcidToUserId = new Map(users.map((u) => [u.orcid, u.id]))

  return raw.map((c, index) => {
    const contributorOrcid = validateOrcid(
      c.nameIdentifiers?.[0]?.nameIdentifier,
    )
    return {
      name: c.name ||
        [c.familyName, c.givenName].filter(Boolean).join(", ") ||
        "Unknown Contributor",
      givenName: c.givenName,
      familyName: c.familyName,
      orcid: contributorOrcid,
      contributorType: c.contributorType || "Researcher",
      userId: contributorOrcid
        ? orcidToUserId.get(contributorOrcid)
        : undefined,
      order: index + 1,
    }
  })
}

/**
 * Update contributors in datacite.yml
 */
export const updateContributors = async (
  datasetId: string,
  revision: string | undefined,
  newContributors: Contributor[],
  user: string,
): Promise<boolean> => {
  try {
    let dataciteData = await getDataciteYml(datasetId, revision)

    // If no datacite.yml, create a new one
    if (!dataciteData) {
      dataciteData = await emptyDataciteYml({ datasetId, revision })
    }

    // Map contributors to RawDataciteContributor format
    const rawContributors: RawDataciteContributor[] = newContributors.map((
      c,
    ) => ({
      name: c.name,
      givenName: c.givenName,
      familyName: c.familyName,
      contributorType: c.contributorType || "Researcher",
      nameType: "Personal" as const,
      nameIdentifiers: c.orcid
        ? [{ nameIdentifier: c.orcid, nameIdentifierScheme: "ORCID" }]
        : [],
    }))

    dataciteData.data.attributes.contributors = rawContributors
    dataciteData.data.attributes.creators = rawContributors

    await saveDataciteYmlToRepo(datasetId, user, dataciteData)

    return true
  } catch (err) {
    Sentry.captureException(err)
    return false
  }
}

/**
 * Utility function to update contributors in datacite.yml
 */
export const updateContributorsUtil = async (
  datasetId: string,
  newContributors: Contributor[],
  userId: string,
) => {
  let dataciteData = await getDataciteYml(datasetId)
  if (!dataciteData) dataciteData = await emptyDataciteYml({ datasetId })

  //
  // 1. Build contributors (full form, includes `order`)
  //
  const contributorsCopy: RawDataciteContributor[] = newContributors.map((
    c,
    index,
  ) => ({
    name: c.name,
    givenName: c.givenName || "",
    familyName: c.familyName || "",
    nameType: "Personal" as const,
    nameIdentifiers: c.orcid
      ? [{
        nameIdentifier: `https://orcid.org/${
          c.orcid.replace(/^https?:\/\/orcid\.org\//, "")
        }`,
        nameIdentifierScheme: "ORCID",
        schemeUri: "https://orcid.org",
      }]
      : [],
    contributorType: c.contributorType || "Researcher",
    order: index + 1,
  }))

  dataciteData.data.attributes.contributors = contributorsCopy

  //
  // 2. Build creators (strictly filtered / no empty fields / no order)
  //
  type RawDataciteCreator = Omit<
    RawDataciteContributor,
    "contributorType" | "order"
  >

  const creators: RawDataciteCreator[] = contributorsCopy.map((c) => {
    const creator: RawDataciteCreator = {
      name: c.name,
      nameType: "Personal",
    }

    if (c.givenName?.trim()) creator.givenName = c.givenName
    if (c.familyName?.trim()) creator.familyName = c.familyName
    if (c.nameIdentifiers?.length) creator.nameIdentifiers = c.nameIdentifiers

    return creator
  })

  dataciteData.data.attributes.creators = creators

  //
  // 3. Save and commit once
  //
  const gitRef = await saveDataciteYmlToRepo(datasetId, userId, dataciteData)

  return {
    draft: {
      id: datasetId,
      contributors: contributorsCopy,
      files: [],
      modified: new Date().toISOString(),
    },
    gitRef: gitRef.id,
  }
}
