import { builder } from "../builder"
import { Severity } from "./enums"
import { ValidationIssueFile } from "./files"

export const ValidatorCodeMessage = builder.simpleObject(
  "ValidatorCodeMessage",
  {
    fields: (t) => ({
      code: t.string({ nullable: false }),
      message: t.string({ nullable: false }),
    }),
  },
)

export const ValidatorIssue = builder.simpleObject("ValidatorIssue", {
  description: "BIDS Validator (schema) issues",
  fields: (t) => ({
    code: t.string({ nullable: false }),
    subCode: t.string(),
    location: t.string(),
    severity: t.field({ type: Severity }),
    rule: t.string(),
    issueMessage: t.string(),
    affects: t.string(),
    line: t.int(),
  }),
})

export const DatasetValidation = builder.simpleObject("DatasetValidation", {
  fields: (t) => ({
    id: t.string(),
    datasetId: t.string(),
    issues: t.field({
      type: [ValidatorIssue],
      nullable: { list: true, items: true },
    }),
    codeMessages: t.field({
      type: [ValidatorCodeMessage],
      nullable: { list: true, items: true },
    }),
    errors: t.int(),
    warnings: t.int(),
  }),
})

export const ValidationIssue = builder.simpleObject("ValidationIssue", {
  fields: (t) => ({
    severity: t.field({ type: Severity, nullable: false }),
    key: t.string({ nullable: false }),
    code: t.int(),
    reason: t.string({ nullable: false }),
    files: t.field({
      type: [ValidationIssueFile],
      nullable: { list: true, items: true },
    }),
    additionalFileCount: t.int(),
    helpUrl: t.string(),
  }),
})

export const ValidationIssueStatus = builder.simpleObject(
  "ValidationIssueStatus",
  {
    description: "Legacy validator count of errors and warnings",
    fields: (t) => ({
      errors: t.int(),
      warnings: t.int(),
    }),
  },
)
