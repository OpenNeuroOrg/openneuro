import { Command } from "../deps.ts"
import { readConfig } from "../config.ts"

export const download = new Command()
  .name("download")
  .description("Download a dataset from OpenNeuro")
  .arguments("<accession_number> <dataset_directory>")

export async function downloadAction(
  options: CommandOptions,
  dataset_directory: string,
) {
  const clientConfig = readConfig()
}
