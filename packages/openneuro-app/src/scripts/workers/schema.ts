import { runValidator } from "./schema.worker"
import type { ValidationResult } from "@bids/validator/main"

export function validation(files): Promise<ValidationResult> {
  return runValidator(files)
}
