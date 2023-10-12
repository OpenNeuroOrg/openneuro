import { Command } from "../deps.ts"

export const download = new Command()
  .name("download")
  .description("Download a dataset from OpenNeuro")
  .arguments("<accession_number> <dataset_directory>")
