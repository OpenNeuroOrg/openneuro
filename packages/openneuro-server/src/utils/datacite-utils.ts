import yaml from "js-yaml"
import * as Sentry from "@sentry/node"
import { fileUrl } from "../datalad/files"
import type { RawDataciteYml } from "../types/datacite"

/**
 * Attempts to read and parse the datacite metadata file from the remote source.
 *
 * @param datasetId The ID of the dataset.
 * @param revision The specific revision of the dataset.
 * @returns A Promise that resolves to the parsed RawDataciteYml object or null if not found.
 */
export const getDataciteYml = async (
  datasetId: string,
  revision: string,
): Promise<RawDataciteYml | null> => {
  // Construct the URL to the datacite.yml file for the given dataset and revision.
  const dataciteFileUrl = fileUrl(datasetId, "", "datacite", revision)

  try {
    const res = await fetch(dataciteFileUrl)
    const contentType = res.headers.get("content-type")

    if (res.status === 200) {
      // Log a message if the content type is not what we expect, but proceed with parsing.
      if (
        !contentType?.includes("application/yaml") &&
        !contentType?.includes("text/yaml")
      ) {
        Sentry.captureMessage(
          `Datacite file for ${datasetId}:${revision} served with unexpected Content-Type: ${contentType}. Attempting YAML parse anyway.`,
        )
      }

      const text = await res.text()
      try {
        // Parse the YAML content into a JavaScript object with the specified type.
        const parsedYaml: RawDataciteYml = yaml.load(text) as RawDataciteYml
        return parsedYaml
      } catch (parseErr) {
        // If parsing fails, throw a detailed error.
        throw new Error(
          `Found datacite file for dataset ${datasetId} (revision: ${revision}), but failed to parse it as YAML:`,
          { cause: parseErr },
        )
      }
    } else if (res.status === 404) {
      // If the file is not found (404) return null.
      return null
    } else {
      // For any other unexpected status code, throw an error.
      throw new Error(
        `Attempted to read datacite file for dataset ${datasetId} (revision: ${revision}) and received status ${res.status}.`,
      )
    }
  } catch (fetchErr) {
    // Catch any network or other errors during the fetch and report them to Sentry.
    Sentry.captureException(fetchErr)
    return null
  }
}
