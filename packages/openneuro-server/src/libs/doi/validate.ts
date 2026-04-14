import type { DataCite } from "../../types/datacite"

export interface ValidationError {
  field: string
  message: string
}

/**
 * Validate required Datacite metadata fields before submitting to the API.
 * Returns an empty array if valid.
 */
export function validateDataciteMetadata(
  attrs: Partial<DataCite>,
): ValidationError[] {
  const errors: ValidationError[] = []

  if (!Array.isArray(attrs.creators) || attrs.creators.length === 0) {
    errors.push({
      field: "creators",
      message: "At least one creator is required",
    })
  } else {
    for (const creator of attrs.creators) {
      if (!creator.name) {
        errors.push({
          field: "creators",
          message: "Each creator must have a name",
        })
        break
      }
    }
  }

  if (!Array.isArray(attrs.titles) || attrs.titles.length === 0) {
    errors.push({ field: "titles", message: "At least one title is required" })
  } else if (!attrs.titles[0].title) {
    errors.push({ field: "titles", message: "Title must not be empty" })
  }

  if (!attrs.publisher?.name) {
    errors.push({ field: "publisher", message: "Publisher name is required" })
  }

  if (!attrs.publicationYear || !/^[0-9]{4}$/.test(attrs.publicationYear)) {
    errors.push({
      field: "publicationYear",
      message: "Publication year must be a four-digit year string",
    })
  }

  if (!attrs.types?.resourceTypeGeneral) {
    errors.push({
      field: "types",
      message: "resourceTypeGeneral is required",
    })
  }

  return errors
}
