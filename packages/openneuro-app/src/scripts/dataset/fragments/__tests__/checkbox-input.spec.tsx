import React from "react"
import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import CheckboxInput from "../checkbox-input"

describe("CheckboxInput", () => {
  it("renders label and checkbox input", () => {
    render(
      <CheckboxInput
        name="testCheckbox"
        label="Test Checkbox Label"
        value={false}
        onChange={() => {}}
      />,
    )
    const checkbox = screen.getByRole("checkbox", {
      name: /test checkbox label/i,
    })
    expect(checkbox).toBeInTheDocument()
    expect(checkbox).not.toBeChecked()
  })

  it("renders checked when value is true", () => {
    render(
      <CheckboxInput
        name="testCheckbox"
        label="Test Checkbox Label"
        value={true}
        onChange={() => {}}
      />,
    )
    const checkbox = screen.getByRole("checkbox", {
      name: /test checkbox label/i,
    })
    expect(checkbox).toBeChecked()
  })

  it("renders extended description below the label", () => {
    render(
      <CheckboxInput
        name="testCheckbox"
        label="Test Checkbox Label"
        description="This is an extended description explaining the field."
        value={false}
        onChange={() => {}}
      />,
    )
    expect(
      screen.getByText("This is an extended description explaining the field."),
    ).toBeInTheDocument()
  })

  it("renders extendedDescription prop if description is not provided", () => {
    render(
      <CheckboxInput
        name="testCheckbox"
        label="Test Checkbox Label"
        extendedDescription="This is an extended description via extendedDescription prop."
        value={false}
        onChange={() => {}}
      />,
    )
    expect(
      screen.getByText(
        "This is an extended description via extendedDescription prop.",
      ),
    ).toBeInTheDocument()
  })

  it("calls onChange with name and new boolean value when clicked", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <CheckboxInput
        name="syntheticDataset"
        label="Contains Synthetic Data"
        value={false}
        onChange={onChange}
      />,
    )
    const checkbox = screen.getByRole("checkbox", {
      name: /contains synthetic data/i,
    })
    await act(async () => {
      await user.click(checkbox)
    })
    expect(onChange).toHaveBeenCalledWith("syntheticDataset", true)
  })

  it("renders disabled state when disabled is true", () => {
    render(
      <CheckboxInput
        name="testCheckbox"
        label="Test Checkbox Label"
        disabled={true}
        value={true}
        onChange={() => {}}
      />,
    )
    const checkbox = screen.getByRole("checkbox", {
      name: /test checkbox label/i,
    })
    expect(checkbox).toBeDisabled()
  })

  it("renders annotated asterisk when annotated is true", () => {
    const { container } = render(
      <CheckboxInput
        name="testCheckbox"
        label="Test Checkbox Label"
        annotated={true}
        value={false}
        onChange={() => {}}
      />,
    )
    expect(container.querySelector(".fa-asterisk")).toBeInTheDocument()
  })
})
