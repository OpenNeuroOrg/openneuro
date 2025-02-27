import {
  createDatasetAffirmed,
  CreateDatasetAffirmedError,
} from "./create-dataset.ts"
import { assertEquals, assertRejects } from "@std/assert"

Deno.test("createDatasetAffirmed - with affirmed options", async () => {
  const datasetId = await createDatasetAffirmed({
    affirmDefaced: true,
    affirmConsent: false,
  }, () => Promise.resolve("ds000001"))
  assertEquals(datasetId, "ds000001")
})

Deno.test("createDatasetAffirmed - with prompt", async () => {
  const datasetId = await createDatasetAffirmed(
    {},
    () => Promise.resolve("ds000002"),
    // @ts-expect-error Mocked method
    () => Promise.resolve({ affirmedDefaced: true, affirmedConsent: false }),
  )
  assertEquals(datasetId, "ds000002")
})

Deno.test("createDatasetAffirmed - with prompt and no affirmation", async () => {
  await assertRejects(
    async () => {
      await createDatasetAffirmed(
        {},
        () => Promise.resolve("ds000003"),
        // @ts-expect-error Mocked method
        () =>
          Promise.resolve({ affirmedDefaced: false, affirmedConsent: false }),
      )
    },
    CreateDatasetAffirmedError,
    "You must affirm defacing or consent to upload without defacing to continue.",
  )
})
