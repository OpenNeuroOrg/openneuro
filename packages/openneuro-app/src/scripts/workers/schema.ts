import { runValidator } from "./schema.worker"
import type { ValidationResult } from "@bids/validator/validate"

export function validation(files): Promise<ValidationResult> {
  return runValidator(files)
}
