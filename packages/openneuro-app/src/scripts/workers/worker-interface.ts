// Shared interface for BIDSValidatorIssues shared without cross import for validate and validate.worker
export interface BIDSValidatorIssues {
  issues: Record<string, unknown>[]
  summary: Record<string, unknown>
}
