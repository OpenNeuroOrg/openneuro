import yaml from "js-yaml"
import * as Sentry from "@sentry/node"
import CacheItem, { CacheType } from "../cache/item"
import { redis } from "../libs/redis"
import { fileUrl } from "./files"
import { datasetOrSnapshot } from "../utils/datasetOrSnapshot"
import { getDescriptionObject } from "./description"

// structure for a Authors from datacite.yml with additional Name field
export interface Contributor {
  name: string
  firstname?: string
  lastname?: string
  id?: string // ORCID ID
}

interface RawDataciteAuthor {
  firstname?: string
  lastname?: string
  id?: string
}

/**
 * Attempts to read and parse datacite.yml.
 */
const getDataciteYml = async (
  datasetId: string,
  revision: string,
): Promise<Record<string, unknown> | null> => {
  const dataciteUrl = fileUrl(datasetId, "", "datacite.yml", revision)
  try {
    const res = await fetch(dataciteUrl)
    const contentType = res.headers.get("content-type")

    if (res.status === 200) {
      if (
        !contentType?.includes("application/yaml") &&
        !contentType?.includes("text/yaml")
      ) {
        Sentry.captureMessage(
          `datacite.yml for ${datasetId}:${revision} served with unexpected Content-Type: ${contentType}. Attempting YAML parse anyway.`,
        )
      }

      const text = await res.text()
      try {
        const parsedYaml: Record<string, unknown> = yaml.load(text) as Record<
          string,
          unknown
        >
        return parsedYaml
      } catch (parseErr) {
        throw new Error(
          `Found datacite.yml for dataset ${datasetId} (revision: ${revision}), but failed to parse it as YAML:`,
          { cause: parseErr },
        )
      }
    } else if (res.status === 404) {
      throw new Error(
        `datacite.yml not found for dataset ${datasetId} (revision: ${revision}).`,
      )
    } else {
      throw new Error(
        `Attempted to read datacite.yml for dataset ${datasetId} (revision: ${revision}) and received status ${res.status}.`,
      )
    }
  } catch (fetchErr) {
    throw new Error(
      `Error fetching datacite.yml for dataset ${datasetId} (revision: ${revision}):`,
      { cause: fetchErr },
    )
  }
}

/**
 * Normalizes datacite.yml authors to the Contributor interface.
 * Returns Contributor[]
 */
const normalizeDataciteAuthors = (authors: unknown): Contributor[] => {
  if (!Array.isArray(authors)) {
    return []
  }
  return authors
    .map((author: unknown) => {
      if (typeof author !== "object" || author === null) {
        return null
      }

      const rawAuthor = author as RawDataciteAuthor
      const firstname = typeof rawAuthor.firstname === "string"
        ? rawAuthor.firstname
        : undefined
      const lastname = typeof rawAuthor.lastname === "string"
        ? rawAuthor.lastname
        : undefined
      const id = typeof rawAuthor.id === "string" ? rawAuthor.id : undefined

      // Construct the 'name' field
      const combinedName = [firstname, lastname]
        .filter(Boolean)
        .join(" ")
        .trim()
      if (!combinedName) {
        return null
      }

      const contributor: Contributor = {
        name: combinedName,
        firstname: firstname,
        lastname: lastname,
        id: id,
      }
      return contributor
    })
    .filter(Boolean)
}

/**
 * Normalizes dataset_description.json
 * Returns Contributor[] with only the 'name' field populated from the author string.
 */
const normalizeBidsAuthors = (authors: unknown): Contributor[] => {
  if (!Array.isArray(authors)) {
    return []
  }
  return authors
    .map((authorString) => {
      if (typeof authorString === "string") {
        const trimmedAuthorString = authorString.trim()
        return {
          name: trimmedAuthorString,
        }
      }
      return null
    })
    .filter(Boolean)
}

/**
 * Get contributors (authors) for a dataset, prioritizing datacite.yml.
 */
export const contributors = async (obj): Promise<Contributor[]> => {
  const { datasetId, revision } = datasetOrSnapshot(obj)
  const revisionShort = revision.substring(0, 7)
  // Default fallback for authors if neither file provides them
  const defaultAuthors: Contributor[] = []
  let parsedContributors: Contributor[] | null = null
  // 1. Try to get authors from datacite.yml
  const dataciteCache = new CacheItem(redis, CacheType.dataciteYml, [
    datasetId,
    revisionShort,
  ])
  try {
    const dataciteData = await dataciteCache.get(() =>
      getDataciteYml(datasetId, revision)
    )
    if (dataciteData && Array.isArray(dataciteData.authors)) {
      parsedContributors = normalizeDataciteAuthors(dataciteData.authors)
      Sentry.captureMessage(
        `Loaded contributors from datacite.yml for ${datasetId}:${revision}`,
      )
    }
  } catch (error) {
    Sentry.captureException(error)
  }
  // 2. If datacite.yml didn't provide authors, try dataset_description.json
  if (!parsedContributors || parsedContributors.length === 0) {
    const descriptionJsonCache = new CacheItem(
      redis,
      CacheType.datasetDescription,
      [datasetId, revisionShort],
    )
    try {
      const datasetDescriptionJson = await descriptionJsonCache.get(() =>
        getDescriptionObject(datasetId, revision).then(
          (uncachedDescription) => ({
            id: revision,
            ...uncachedDescription,
          }),
        )
      )
      if (
        datasetDescriptionJson &&
        Array.isArray(datasetDescriptionJson.Authors)
      ) {
        parsedContributors = normalizeBidsAuthors(
          datasetDescriptionJson.Authors,
        )
        Sentry.captureMessage(
          `Loaded contributors from dataset_description.json for ${datasetId}:${revision}`,
        )
      }
    } catch (error) {
      Sentry.captureException(error)
    }
  }
  // Return the parsed contributors or the default empty array
  return parsedContributors || defaultAuthors
}
