import { Confirm, prompt } from "@cliffy/prompt"
import type { CommandOptions } from "@cliffy/command"
import { Command } from "@cliffy/command"
import { createDataset } from "../graphq.ts"
import { getConfig } from "../config.ts"

interface CreateDatasetOptions {
  affirmDefaced?: boolean
  affirmConsent?: boolean
  [otherOptions: string]: unknown
}

/**
 * Expected errors for createDatasetAffirmed
 */
export class CreateDatasetAffirmedError extends Error {
}

/**
 * Create a dataset and affirm deface or consent based on provided command options
 * @param options
 * @returns {string} DatasetId for the created dataset
 */
export async function createDatasetAffirmed(
  options: CreateDatasetOptions,
  graphqlCreateDataset = createDataset,
  cliffyPrompt = prompt,
) {
  let affirmedDefaced = options.affirmDefaced || false
  let affirmedConsent = options.affirmConsent || false
  if (affirmedDefaced || affirmedConsent) {
    return await graphqlCreateDataset(affirmedDefaced, affirmedConsent)
  } else {
    const affirmed = await cliffyPrompt([
      {
        name: "affirmedDefaced",
        message:
          "All structural scans have been defaced, obscuring any tissue on or near the face that could potentially be used to reconstruct the facial structure.",
        type: Confirm,
      },
      {
        name: "affirmedConsent",
        message:
          "I have explicit participant consent and ethical authorization to publish structural scans without defacing.",
        type: Confirm,
      },
    ])
    affirmedDefaced = affirmed.affirmedDefaced || false
    affirmedConsent = affirmed.affirmedConsent || false
    if (affirmedDefaced || affirmedConsent) {
      return await graphqlCreateDataset(affirmedDefaced, affirmedConsent)
    } else {
      throw new CreateDatasetAffirmedError(
        "You must affirm defacing or consent to upload without defacing to continue.",
      )
    }
  }
}

export const createDatasetCommand = new Command()
  .description(
    "Create a new dataset and reserve an accession number, `upload` does this automatically",
  )
  .action(async (options: CommandOptions) => {
    try {
      const config = getConfig()
      const datasetId = await createDatasetAffirmed(options)
      console.log(
        `${datasetId} created at ${config.url}/datasets/${datasetId}.`,
      )
    } catch (error) {
      console.log(
        "Dataset could not be created.",
      )
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`)
        throw error
      }
    }
  })
