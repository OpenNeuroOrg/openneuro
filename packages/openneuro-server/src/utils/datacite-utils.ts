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
/**
 * Returns a minimal datacite.yml structure
 */
export const emptyDataciteYml = (): RawDataciteYml => ({
  data: {
    attributes: {
      types: { resourceTypeGeneral: "Dataset" },
      contributors: [],
      creators: [],
    },
  },
})

/**
 * Fetch datacite.yml for a dataset revision
 */
export const getDataciteYml = async (
  datasetId: string,
  revision?: string,
): Promise<RawDataciteYml | null> => {
  const dataciteFileUrl = fileUrl(datasetId, "", "datacite", revision)

  try {
    const res = await fetch(dataciteFileUrl)
    if (res.status === 200) {
      const text = await res.text()
      const parsed: RawDataciteYml = yaml.load(text) as RawDataciteYml

      return parsed
    } else if (res.status === 404) {
      return null
    } else {
      throw new Error(
        `Unexpected status ${res.status} when fetching datacite.yml`,
      )
    }
  } catch (err) {
    Sentry.captureException(err)
    return null
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
      dataciteData = emptyDataciteYml()
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
  if (!dataciteData) dataciteData = emptyDataciteYml()

  const contributorsCopy: RawDataciteContributor[] = newContributors.map(
    (c) => ({
      name: c.name,
      givenName: c.givenName || "",
      familyName: c.familyName || "",
      order: c.order ?? null,
      nameType: "Personal" as const,
      nameIdentifiers: c.orcid
        ? [{
          nameIdentifier: `https://orcid.org/${c.orcid}`,
          nameIdentifierScheme: "ORCID",
          schemeUri: "https://orcid.org",
        }]
        : [],
      contributorType: c.contributorType || "Researcher",
    }),
  )

  dataciteData.data.attributes.contributors = contributorsCopy
  dataciteData.data.attributes.creators = contributorsCopy.map((
    { contributorType: _, ...rest },
  ) => rest)

  await saveDataciteYmlToRepo(datasetId, userId, dataciteData)

  return {
    draft: {
      id: datasetId,
      contributors: contributorsCopy,
      files: [],
      modified: new Date().toISOString(),
    },
  }
}
