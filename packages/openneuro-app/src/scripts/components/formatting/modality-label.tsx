/**
 * Provide a mapping from the schema names to an expected short name used for OpenNeuro display
 */
export function modalityShortMapping(modality) {
  switch (modality) {
    case "ieeg":
    case "iEEG":
      return "iEEG"
    case "beh":
      return "Behavioral"
    case "motion":
      return "Motion"
    case undefined:
      return undefined
    case null:
      return null
    default:
      return modality.toUpperCase()
  }
}

interface ModalityLabelProps {
  // TODO: type could be schema.objects.modalities if it had a type definition
  modality: string
}

/**
 * String mapping component that renders schema modality labels as human readable labels
 */
export function ModalityLabel({ modality }: ModalityLabelProps) {
  return modalityShortMapping(modality)
}
