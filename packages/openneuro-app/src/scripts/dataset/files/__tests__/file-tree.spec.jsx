import React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { MockedProvider } from "@apollo/client/testing"
import FileTree, { fileTreeLevels, unescapePath } from "../file-tree"

// official Jest workaround for mocking methods not implemented in JSDOM
window.matchMedia = window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: vi.fn(),
      removeListener: vi.fn(),
    }
  }

const datasetFiles = [
  {
    id: "b42624c6aea63fc5e3f6f3e712d9e44adc4dbfdc",
    key: "834b88a80109f1b38e0ab85999090170889469ce",
    filename: "CHANGES",
    size: 59,
    directory: false,
    annexed: false,
  },
  {
    id: "63888a199a5ce37377b1cd708cda59577dad218f",
    key: "fa84e5f958ec72d42b3e196e592f6db9f7104b19",
    filename: "README",
    size: 709,
    directory: false,
    annexed: false,
  },
  {
    id: "a2922b427c5c997e77ce058e0ce57ffd17123a7f",
    key: "0b1856b91c11f67098ce60114417a62dd55730a5",
    filename: "dataset_description.json",
    size: 172,
    directory: false,
    annexed: false,
  },
  {
    id: "a6378eea201d9cad639e0bee328e03132d30489d",
    key: null,
    filename: "sub-01",
    size: 0,
    directory: true,
    annexed: false,
  },
]

const anatDir = {
  id: "9703f3f6b4137c2b86a3a712eb34d78bdec9fd72",
  key: null,
  filename: "sub-01:anat",
  size: 0,
  directory: true,
  annexed: false,
}

const niftiFile = {
  id: "69fd3617b27125c433ea5f8e0e2052c31828c253",
  key: "MD5E-s311112--bc8bbbacfd2ff823c2047ead1afec9b3.nii.gz",
  filename: "sub-01:anat:sub-01_T1w.nii.gz",
  size: 311112,
  directory: false,
  annexed: true,
}

describe("fileTreeLevels()", () => {
  it("handles top level files correctly", () => {
    const { childFiles, currentFiles } = fileTreeLevels("", datasetFiles)
    expect(currentFiles).toEqual(
      expect.arrayContaining([
        currentFiles.find(
          (f) => f.id === "a2922b427c5c997e77ce058e0ce57ffd17123a7f",
        ),
      ]),
    )
    expect(childFiles).toEqual({})
  })
  it("passes childFiles to the next level", () => {
    const levelOneFiles = [...datasetFiles, anatDir]
    const { childFiles, currentFiles } = fileTreeLevels("", levelOneFiles)
    expect(currentFiles).toEqual(
      expect.arrayContaining([
        currentFiles.find(
          (f) => f.id === "a2922b427c5c997e77ce058e0ce57ffd17123a7f",
        ),
      ]),
    )
    expect(childFiles["sub-01"]).toEqual(expect.arrayContaining([anatDir]))
  })
  it("passes two level deep childFiles to the next level", () => {
    const levelTwoFiles = [...datasetFiles, anatDir, niftiFile]
    const { childFiles, currentFiles } = fileTreeLevels("", levelTwoFiles)
    expect(currentFiles).toEqual(
      expect.arrayContaining([
        currentFiles.find(
          (f) => f.id === "a2922b427c5c997e77ce058e0ce57ffd17123a7f",
        ),
      ]),
    )
    expect(childFiles["sub-01"]).toEqual(expect.arrayContaining([niftiFile]))
  })
  it("passes two level deep childFiles to the next level", () => {
    const levelTwoFiles = [anatDir, niftiFile]
    const { childFiles, currentFiles } = fileTreeLevels("sub-01", levelTwoFiles)
    expect(currentFiles).toEqual(
      expect.arrayContaining([
        currentFiles.find(
          (f) => f.id === "9703f3f6b4137c2b86a3a712eb34d78bdec9fd72",
        ),
      ]),
    )
    expect(childFiles["sub-01:anat"]).toEqual(
      expect.arrayContaining([niftiFile]),
    )
  })
})

describe("FileTree component", () => {
  it("renders with default props", () => {
    const { asFragment } = render(<FileTree />)
    expect(asFragment()).toMatchSnapshot()
  })
  it("expands and closes when clicked", () => {
    render(
      <MockedProvider>
        <FileTree name="Top Level" />
      </MockedProvider>,
    )
    // Test the folder icon is closed
    expect(screen.getByLabelText("Top Level").firstChild).toHaveClass(
      "fa-folder",
    )
    expect(screen.getByLabelText("Top Level").firstChild).not.toHaveClass(
      "fa-folder-open",
    )
    // Click it
    fireEvent.click(screen.getByLabelText("Top Level"))
    // Test that it is now open
    expect(screen.getByLabelText("Top Level").firstChild).toHaveClass(
      "fa-folder-open",
    )
    expect(screen.getByLabelText("Top Level").firstChild).not.toHaveClass(
      "fa-folder",
    )
  })
  describe("unescapePath()", () => {
    it("does not alter an already escaped path", () => {
      expect(unescapePath("sub-01/anat")).toBe("sub-01/anat")
    })
    it("does unescapes any : characters", () => {
      expect(unescapePath("sub-01:anat")).toBe("sub-01/anat")
    })
    it("unescapes multiple : characters", () => {
      expect(unescapePath("sub-01:anat:image.nii.gz")).toBe(
        "sub-01/anat/image.nii.gz",
      )
    })
  })
})
