import React from "react"
import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import MetadataForm from "../metadata-form.jsx"

describe("MetadataForm", () => {
  it("renders boolean fields as checkboxes with extended descriptions", () => {
    render(
      <MetadataForm
        values={{}}
        onChange={() => {}}
        hasEdit={true}
        hideDisabled={false}
      />,
    )

    const syntheticCheckbox = screen.getByRole("checkbox", {
      name: /contains synthetic data/i,
    })
    expect(syntheticCheckbox).toBeInTheDocument()
    expect(syntheticCheckbox).not.toBeChecked()

    const defacedCheckbox = screen.getByRole("checkbox", {
      name: /uploader affirmed structural scans are defaced/i,
    })
    expect(defacedCheckbox).toBeInTheDocument()
    expect(defacedCheckbox).not.toBeChecked()

    const consentCheckbox = screen.getByRole("checkbox", {
      name: /uploader affirmed consent to publish scans without defacing/i,
    })
    expect(consentCheckbox).toBeInTheDocument()
    expect(consentCheckbox).not.toBeChecked()

    // Extended descriptions
    expect(
      screen.getByText(
        "Indicates whether the dataset contains synthetic data.",
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        "Affirms or refutes that all structural scans have been defaced, obscuring any tissue on or near the face that could potentially be used to reconstruct the facial structure.",
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        "Affirms or refutes that I have explicit participant consent and ethical authorization to publish structural scans without defacing",
      ),
    ).toBeInTheDocument()
  })

  it("renders dataProcessed as a disabled checkbox when hideDisabled is false", () => {
    render(
      <MetadataForm
        values={{ dataProcessed: true }}
        onChange={() => {}}
        hasEdit={true}
        hideDisabled={false}
      />,
    )

    const dataProcessedCheckbox = screen.getByRole("checkbox", {
      name: /has processed data/i,
    })
    expect(dataProcessedCheckbox).toBeInTheDocument()
    expect(dataProcessedCheckbox).toBeChecked()
    expect(dataProcessedCheckbox).toBeDisabled()
  })

  it("hides disabled fields when hideDisabled is true", () => {
    render(
      <MetadataForm
        values={{}}
        onChange={() => {}}
        hasEdit={true}
        hideDisabled={true}
      />,
    )

    expect(
      screen.queryByRole("checkbox", { name: /has processed data/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole("checkbox", { name: /contains synthetic data/i }),
    ).toBeInTheDocument()
  })

  it("triggers onChange when a checkbox is toggled", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <MetadataForm
        values={{ syntheticDataset: false }}
        onChange={onChange}
        hasEdit={true}
        hideDisabled={true}
      />,
    )

    const syntheticCheckbox = screen.getByRole("checkbox", {
      name: /contains synthetic data/i,
    })

    await act(async () => {
      await user.click(syntheticCheckbox)
    })

    expect(onChange).toHaveBeenCalledWith("syntheticDataset", true)
  })

  it("disables all checkboxes when hasEdit is false", () => {
    render(
      <MetadataForm
        values={{ syntheticDataset: true }}
        onChange={() => {}}
        hasEdit={false}
        hideDisabled={false}
      />,
    )

    const syntheticCheckbox = screen.getByRole("checkbox", {
      name: /contains synthetic data/i,
    })
    expect(syntheticCheckbox).toBeDisabled()
    expect(syntheticCheckbox).toBeChecked()
  })

  it("renders validation errors when provided", () => {
    render(
      <MetadataForm
        values={{}}
        onChange={() => {}}
        hasEdit={true}
        validationErrors={["Please affirm defacing or consent."]}
      />,
    )

    expect(
      screen.getByText("Please affirm defacing or consent."),
    ).toBeInTheDocument()
  })
})
