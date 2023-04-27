// Shared interface for BIDSValidatorIssues shared without cross import for validate and validate.worker
export interface BIDSValidatorIssues {
  issues: {
    errors: Record<string, unknown>[]
    warnings: Record<string, unknown>[]
  }
  summary: Record<string, unknown>
}
