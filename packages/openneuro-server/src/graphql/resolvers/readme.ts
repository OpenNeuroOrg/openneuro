/**
 * Resolver implementation for README files
 * This stub is here in case draft.readme or snapshot.readme needs future extension
 */
import { setReadme } from "../../datalad/readme"
import { checkDatasetWrite } from "../permissions"
export { readme } from "../../datalad/readme"
import { draftFiles } from "./draft"

export async function updateReadme(
  obj,
  { datasetId, value },
  { user, userInfo },
) {
  await checkDatasetWrite(datasetId, user, userInfo)
  const files = await draftFiles({ id: datasetId }, { tree: "HEAD" }, {
    userInfo,
  })
  // Default to README.md if none exists
  let filename = "README.md"
  for (const file of files) {
    if (
      file.filename === "README.md" || file.filename === "README.rst" ||
      file.filename === "README.txt" ||
      file.filename === "README"
    ) {
      filename = file.filename
      break
    }
  }
  // Save to backend
  await setReadme(datasetId, value, filename, userInfo)
  return true
}
