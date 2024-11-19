import { isNifti, isNwb } from "../file-types"

describe("isNifti()", () => {
  it("detects nifti files", () => {
    expect(isNifti("sub-01/anat/sub-01_T1w.nii.gz")).toBeTruthy()
    expect(isNifti("dataset_description.json")).toBeFalsy()
  })
})
describe("isNwb()", () => {
  it("detects nwb/edf files", () => {
    expect(isNwb("eeg/sub-5_task-oa_eeg.edf")).toBeTruthy()
    expect(isNwb("eeg/sub-cbm009_task-protmap_eeg.edf")).toBeTruthy()
    expect(isNwb("sub-01/anat/sub-01_T1w.nii.gz")).toBeFalsy()
  })
})
