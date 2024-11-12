import React from "react"
import { render, screen } from "@testing-library/react"
import { DatasetIssues } from "@bids/validator/issues"
import { Issue, Issues } from "../validation-issues"

describe("Issue component", () => {
  it("renders one issue", () => {
    const datasetIssues = new DatasetIssues()
    datasetIssues.codeMessages.set(
      "JSON_KEY_RECOMMENDED",
      "A JSON file is missing a key listed as recommended.",
    )
    const issue = {
      code: "JSON_KEY_RECOMMENDED",
      location: "/dataset_description.json",
      rule: "rules.dataset_metadata.dataset_description",
      subCode: "DatasetType",
    }

    const { asFragment } = render(
      <Issue datasetIssues={datasetIssues} issue={issue} groupBy="code" />,
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
describe("Issues component", () => {
  it("renders multiple issues", () => {
    const datasetIssues = new DatasetIssues()
    datasetIssues.codeMessages.set(
      "JSON_KEY_RECOMMENDED",
      "A JSON file is missing a key listed as recommended.",
    )
    const issue = {
      code: "JSON_KEY_RECOMMENDED",
      location: "/dataset_description.json",
      rule: "rules.dataset_metadata.dataset_description",
      subCode: "DatasetType",
    }
    datasetIssues.issues = [{ ...issue }, { ...issue }, { ...issue }, {
      ...issue,
    }]
    const { asFragment } = render(
      <Issues issues={datasetIssues} groupBy="code" />,
    )
    expect(asFragment()).toMatchSnapshot()
  })
  it("sorts issues by the groupBy argument", async () => {
    const datasetIssues = new DatasetIssues()
    datasetIssues.codeMessages.set(
      "JSON_KEY_RECOMMENDED",
      "A JSON file is missing a key listed as recommended.",
    )
    datasetIssues.codeMessages.set(
      "SIDECAR_KEY_RECOMMENDED",
      "A data file's JSON sidecar is missing a key listed as recommended.",
    )
    datasetIssues.issues = [{
      code: "JSON_KEY_RECOMMENDED",
      location: "/dataset_description.json",
      severity: "warning",
      rule: "rules.dataset_metadata.dataset_description",
      subCode: "DatasetType",
    }, {
      code: "JSON_KEY_RECOMMENDED",
      subCode: "GeneratedBy",
      location: "/dataset_description.json",
      severity: "warning",
      rule: "rules.dataset_metadata.dataset_description",
    }, {
      code: "SIDECAR_KEY_RECOMMENDED",
      subCode: "ManufacturersModelName",
      location: "/sub-01/anat/sub-01_T1w.nii.gz",
      severity: "warning",
      rule: "rules.sidecars.mri.MRIHardware",
    }]
    await render(
      <Issues issues={datasetIssues} groupBy="location" />,
    )
    const headings = await screen.getAllByRole("heading")
    expect(headings[0].textContent).toMatch("/dataset_description.json2 issues")
    expect(headings[1].textContent).toMatch(
      "/sub-01/anat/sub-01_T1w.nii.gz1 issues",
    )
  })
})
