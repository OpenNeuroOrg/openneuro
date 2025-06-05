import React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { vi } from "vitest"
import UpdateFile from "../update-file"
import UploaderContext from "../../../uploader/uploader-context.js"

describe("UpdateFile Component", () => {
  const mockResumeDataset = vi.fn()
  const mockUploader = {
    resumeDataset: vi.fn(() => mockResumeDataset),
  }

  const datasetId = "ds000001"
  const path = "sub-01/anat"

  const renderComponent = (props = {}, uploader = mockUploader) => {
    return render(
      <UploaderContext.Provider value={uploader}>
        <UpdateFile datasetId={datasetId} path={path} {...props}>
          <button>Upload Button</button>
        </UpdateFile>
      </UploaderContext.Provider>,
    )
  }

  it("renders children correctly", () => {
    renderComponent()
    expect(screen.getByText("Upload Button")).toBeInTheDocument()
  })

  it("sets webkitdirectory attribute when directory prop is true", () => {
    renderComponent({ directory: true })
    const inputElement = screen.getByRole("button", { name: "Upload Button" })
      .previousSibling // The input is before the children
    expect(inputElement).toHaveAttribute("webkitdirectory", "true")
  })

  it("does not set webkitdirectory attribute when directory prop is false", () => {
    renderComponent({ directory: false })
    const inputElement = screen.getByRole("button", { name: "Upload Button" })
      .previousSibling
    expect(inputElement).not.toHaveAttribute("webkitdirectory")
  })

  it("sets multiple attribute when multiple prop is true", () => {
    renderComponent({ multiple: true })
    const inputElement = screen.getByRole("button", { name: "Upload Button" })
      .previousSibling
    expect(inputElement).toHaveAttribute("multiple")
  })

  it("does not set multiple attribute when multiple prop is false", () => {
    renderComponent({ multiple: false })
    const inputElement = screen.getByRole("button", { name: "Upload Button" })
      .previousSibling
    expect(inputElement).not.toHaveAttribute("multiple")
  })

  describe("onChange event", () => {
    const file1 = new File(["content1"], "original1.txt", {
      type: "text/plain",
    })
    const file2 = new File(["content2"], "original2.txt", {
      type: "text/plain",
    })

    it("calls uploader.resumeDataset with renamed file when filename is provided and one file is selected", () => {
      const customFilename = "new_filename.txt"
      renderComponent({ filename: customFilename })
      const inputElement = screen.getByRole("button", { name: "Upload Button" })
        .previousSibling

      fireEvent.change(inputElement, {
        target: { files: [file1] },
      })

      expect(mockUploader.resumeDataset).toHaveBeenCalledWith(
        datasetId,
        path,
        false,
      )
      expect(mockResumeDataset).toHaveBeenCalledTimes(1)
      const calledWithArgs = mockResumeDataset.mock.calls[0][0]
      expect(calledWithArgs.files).toHaveLength(1)
      expect(calledWithArgs.files[0].name).toBe(customFilename)
      expect(calledWithArgs.files[0].type).toBe(file1.type)
    })

    it("calls uploader.resumeDataset with original files when filename is not provided", () => {
      renderComponent()
      const inputElement = screen.getByRole("button", { name: "Upload Button" })
        .previousSibling

      fireEvent.change(inputElement, {
        target: { files: [file1, file2] },
      })

      expect(mockUploader.resumeDataset).toHaveBeenCalledWith(
        datasetId,
        path,
        false,
      )
      expect(mockResumeDataset).toHaveBeenCalledTimes(1)
      expect(mockResumeDataset).toHaveBeenCalledWith({ files: [file1, file2] })
    })

    it("calls uploader.resumeDataset with original files when multiple files are selected, even if filename is provided", () => {
      const customFilename = "new_filename.txt"
      renderComponent({ filename: customFilename, multiple: true })
      const inputElement = screen.getByRole("button", { name: "Upload Button" })
        .previousSibling

      fireEvent.change(inputElement, {
        target: { files: [file1, file2] },
      })

      expect(mockUploader.resumeDataset).toHaveBeenCalledWith(
        datasetId,
        path,
        false,
      )
      expect(mockResumeDataset).toHaveBeenCalledTimes(1)
      expect(mockResumeDataset).toHaveBeenCalledWith({ files: [file1, file2] })
    })
  })
})
