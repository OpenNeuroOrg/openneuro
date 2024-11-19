export function isNifti(path) {
  return path.endsWith(".nii.gz") ||
    path.endsWith(".nii") ||
    path.endsWith(".mgh") ||
    path.endsWith(".mgz")
}

export function isNwb(path) {
  return path.endsWith(".edf") || path.endsWith(".nwb")
}
