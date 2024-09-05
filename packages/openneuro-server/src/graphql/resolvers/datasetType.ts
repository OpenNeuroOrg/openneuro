import Dataset from "../../models/dataset"
import { description } from "./description.js"

/**
 * Return "schema" or "legacy" depending on the validator preferred for a dataset
 */
export async function datasetType(dsOrSnapshot): Promise<"schema" | "legacy"> {
  const ds = new Dataset({ id: dsOrSnapshot.datasetId })
  if (ds.schemaValidator) {
    return "schema"
  } else {
    const dsDescription = await description(dsOrSnapshot)
    return dsDescription.DatasetType === "derivative" ? "schema" : "legacy"
  }
}
