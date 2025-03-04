import { describe, expect, it, vi } from "vitest"
import { setDefaultSearch } from "../search-container"

describe("SearchContainer component", () => {
  describe("setDefaultSearch", () => {
    it("updates default state when a modality is provided differing from the default", () => {
      const context = { modality_selected: "mri" }
      const setContext = vi.fn()
      setDefaultSearch(
        "mri",
        "",
        false,
        context,
        setContext,
        new URLSearchParams("/search"),
      )
      expect(setContext).not.toHaveBeenCalled()
      setDefaultSearch(
        "pet",
        "",
        false,
        context,
        setContext,
        new URLSearchParams("/search"),
      )
      expect(setContext).toHaveBeenCalled()
    })
    it('sets datasetType_select to my datasets with "mydatasets" parameter', () => {
      let context = {
        modality_selected: "mri",
        datasetType_selected: "All Public",
      }
      const setContext = vi.fn().mockImplementation((arg) => {
        context = arg(context)
      })
      setDefaultSearch(
        "mri",
        "",
        false,
        context,
        setContext,
        new URLSearchParams("mydatasets"),
      )
      expect(context.datasetType_selected).toEqual("My Datasets")
    })
    it('sets datasetType_select to my datasets with "bookmarks" parameter', () => {
      let context = {
        modality_selected: "pet",
        datasetType_selected: "All Public",
      }
      const setContext = vi.fn().mockImplementation((arg) => {
        context = arg(context)
      })
      setDefaultSearch(
        "pet",
        "",
        false,
        context,
        setContext,
        new URLSearchParams("bookmarks"),
      )
      expect(context.datasetType_selected).toEqual("My Bookmarks")
    })
  })
})
