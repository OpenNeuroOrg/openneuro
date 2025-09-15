import * as Sentry from "@sentry/node"
import yaml from "js-yaml"
import superagent from "superagent"
import User from "../models/user"
import { fileUrl } from "../datalad/files"
import { commitFiles } from "../datalad/dataset"
import { generateDataladCookie } from "../libs/authentication/jwt"
import config from "../config"
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
  console.log("Fetching datacite file at URL:", dataciteFileUrl)

  try {
    const res = await fetch(dataciteFileUrl)
    if (res.status === 200) {
      const text = await res.text()
      const parsed: RawDataciteYml = yaml.load(text) as RawDataciteYml
      console.log(
        `Successfully parsed datacite.yml for ${datasetId}:${revision}`,
      )
      return parsed
    } else if (res.status === 404) {
      console.warn(`No datacite.yml found at ${dataciteFileUrl}`)
      return null
    } else {
      throw new Error(
        `Unexpected status ${res.status} when fetching datacite.yml`,
      )
    }
  } catch (err) {
    console.error("Error fetching datacite.yml:", err)
    Sentry.captureException(err)
    return null
  }
}

/**
 * Save datacite.yml back to dataset
 */
export const saveDataciteYmlToRepo = async (
  datasetId: string,
  user: any,
  dataciteData: any,
) => {
  const url = `http://datalad-0/datasets/${datasetId}/files/datacite.yml`

  try {
    // Directly PUT the file with cookie-based JWT auth
    await superagent
      .post(url)
      .set("Cookie", generateDataladCookie(config)(user))
      .set("Accept", "application/json")
      .set("Content-Type", "text/yaml")
      .send(yaml.dump(dataciteData))

    console.log(
      `[saveDataciteYmlToRepo] Uploaded datacite.yml for dataset ${datasetId}`,
    )

    // Commit the draft after upload
    const gitRef = await commitFiles(datasetId, user)
    return { id: gitRef }
  } catch (err) {
    Sentry.captureException(err)
    console.error(`[saveDataciteYmlToRepo] Failed to upload datacite.yml:`, err)
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

  // Extract all ORCIDs to batch query the user DB
  const orcids = raw
    .map((c) => validateOrcid(c.nameIdentifiers?.[0]?.nameIdentifier))
    .filter(Boolean) as string[]

  const users = await User.find({ orcid: { $in: orcids } }).exec()
  const orcidToUserId = new Map(users.map((u) => [u.orcid, u.id]))

  return raw.map((c) => {
    const contributorOrcid = validateOrcid(
      c.nameIdentifiers?.[0]?.nameIdentifier,
    )
    return {
      name: c.name ||
        [c.givenName, c.familyName].filter(Boolean).join(" ") ||
        "Unknown Contributor",
      givenName: c.givenName,
      familyName: c.familyName,
      orcid: contributorOrcid,
      contributorType: c.contributorType || "Contributor",
      userId: contributorOrcid
        ? orcidToUserId.get(contributorOrcid)
        : undefined,
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
  console.log("updateContributors() called with:", {
    datasetId,
    revision,
    newContributors,
    user,
  })

  try {
    let dataciteData = await getDataciteYml(datasetId, revision)
    console.log("Fetched datacite.yml:", dataciteData)

    // If no datacite.yml, create a new one
    if (!dataciteData) {
      console.warn(
        `No datacite.yml found for ${datasetId}. Creating a new one.`,
      )
      dataciteData = emptyDataciteYml()
    }

    // Map contributors to RawDataciteContributor format
    const rawContributors: RawDataciteContributor[] = newContributors.map((
      c,
    ) => ({
      name: c.name,
      givenName: c.givenName,
      familyName: c.familyName,
      contributorType: c.contributorType || "Contributor",
      nameType: "Personal" as const, // <-- FIXED TYPE ERROR
      nameIdentifiers: c.orcid
        ? [{ nameIdentifier: c.orcid, nameIdentifierScheme: "ORCID" }]
        : [],
    }))

    dataciteData.data.attributes.contributors = rawContributors
    dataciteData.data.attributes.creators = rawContributors

    console.log("Saving updated datacite.yml:", dataciteData)

    await saveDataciteYmlToRepo(datasetId, user, dataciteData)
    console.log("Save completed for dataset:", datasetId)

    return true
  } catch (err) {
    console.error("updateContributors() failed:", err)
    Sentry.captureException(err)
    return false // <-- prevent returning null
  }
}
