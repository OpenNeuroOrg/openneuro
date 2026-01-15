import React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import DatasetQueryContext from "../../../datalad/dataset/dataset-query-context.js"
import FileTreeUnloadedDirectory, {
  mergeNewFiles,
} from "../file-tree-unloaded-directory.jsx"

const dir = {
  filename: "test directory",
}

describe("FileTreeUnloadedDirectory component", () => {
  it("calls fetchMoreDirectory when clicked", () => {
    const fetchMore = vi.fn()
    render(
      <DatasetQueryContext.Provider value={{ fetchMore }}>
        <FileTreeUnloadedDirectory datasetId={"ds000001"} directory={dir} />
      </DatasetQueryContext.Provider>,
    )
    // Label is filename
    fireEvent.click(screen.getByLabelText(dir.filename))
    expect(fetchMore).toHaveBeenCalled()
  })
  describe("mergeNewFiles", () => {
    it("should return a new object", () => {
      const defaultObj = { dataset: { draft: { files: [] } } }
      expect(
        mergeNewFiles(defaultObj, { fetchMoreResult: { ...defaultObj } }),
      ).not.toBe(defaultObj)
    })
    it("merges file lists", () => {
      const dir = { filename: "sub-01", directory: true }
      const a = { id: "1234", filename: "a", directory: false }
      const b = { id: "5678", filename: "b", directory: false }
      const c = { id: "91011", filename: "c", directory: false }
      const defaultObj = { dataset: { draft: { files: [a, b] } } }
      const updatedObj = { dataset: { draft: { files: [c] } } }
      expect(
        mergeNewFiles(dir)(defaultObj, { fetchMoreResult: updatedObj }).dataset
          .draft.files,
      ).toEqual([a, b, { ...c, id: "sub-01:91011", filename: "sub-01:c" }])
    })
    it("works with snapshots", () => {
      const dir = { filename: "sub-01", directory: true }
      const a = { id: "1234", filename: "a", directory: false }
      const b = { id: "5678", filename: "b", directory: false }
      const c = { id: "91011", filename: "c", directory: false }
      const defaultObj = { snapshot: { files: [dir, a, b] } }
      const updatedObj = { snapshot: { files: [c] } }
      expect(
        mergeNewFiles(dir, "1.0.0")(defaultObj, { fetchMoreResult: updatedObj })
          .snapshot.files,
      ).toEqual([dir, a, b, {
        ...c,
        id: "sub-01:91011",
        filename: "sub-01:c",
      }])
    })
    it("handles snapshot with undefined files array", () => {
      const dir = { filename: "sub-01", directory: true }
      const c = { id: "91011", filename: "c", directory: false }
      const defaultObj = { snapshot: {} } // files array is undefined
      const updatedObj = { snapshot: { files: [c] } }

      expect(
        mergeNewFiles(dir, "1.0.0")(defaultObj, { fetchMoreResult: updatedObj })
          .snapshot.files,
      ).toEqual([{
        ...c,
        id: "sub-01:91011",
        filename: "sub-01:c",
      }])
    })

    it("handles draft with undefined files array", () => {
      const dir = { filename: "sub-01", directory: true }
      const c = { id: "91011", filename: "c", directory: false }
      const defaultObj = { dataset: { draft: {} } } // files array is undefined
      const updatedObj = { dataset: { draft: { files: [c] } } }

      expect(
        mergeNewFiles(dir)(defaultObj, { fetchMoreResult: updatedObj })
          .dataset.draft.files,
      ).toEqual([{
        ...c,
        id: "sub-01:91011",
        filename: "sub-01:c",
      }])
    })
  })
})
