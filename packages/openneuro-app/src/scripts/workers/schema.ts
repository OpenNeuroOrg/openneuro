import { runValidator } from "./schema.worker"
import { ValidationResult } from "@bids/validator/main"

export function validation(files): Promise<ValidationResult> {
  return runValidator(files)
}
