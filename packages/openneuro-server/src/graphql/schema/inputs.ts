import { builder } from "../builder"
import { SearchSortOption, Severity, SortOrdering } from "./enums"

export const UserSortInput = builder.inputType("UserSortInput", {
  fields: (t) => ({
    field: t.string({ required: true }),
    order: t.field({ type: SortOrdering, defaultValue: "ascending" }),
  }),
})

export const DatasetSort = builder.inputType("DatasetSort", {
  fields: (t) => ({
    created: t.field({ type: SortOrdering }),
    name: t.field({ type: SortOrdering }),
    uploader: t.field({ type: SortOrdering }),
    stars: t.field({ type: SortOrdering }),
    downloads: t.field({ type: SortOrdering }),
    views: t.field({ type: SortOrdering }),
    subscriptions: t.field({ type: SortOrdering }),
    publishDate: t.field({ type: SortOrdering }),
  }),
})

export const DatasetFilter = builder.inputType("DatasetFilter", {
  fields: (t) => ({
    public: t.boolean({
      description: "Limit to datasets available publicly",
    }),
    shared: t.boolean({
      description: "Return only datasets that are shared with the user",
    }),
    invalid: t.boolean({
      description: "Return only datasets with an invalid Draft",
    }),
    starred: t.boolean({
      description: "Return only datasets starred by the query user",
    }),
    all: t.boolean({
      description:
        "Return all datasets, ignores any other constraints but not sorts",
    }),
  }),
})

export const DeleteFile = builder.inputType("DeleteFile", {
  fields: (t) => ({
    path: t.string({ required: true }),
    filename: t.string(),
  }),
})

export const SummaryPetInput = builder.inputType("SummaryPetInput", {
  fields: (t) => ({
    BodyPart: t.stringList(),
    ScannerManufacturer: t.stringList(),
    ScannerManufacturersModelName: t.stringList(),
    TracerName: t.stringList(),
    TracerRadionuclide: t.stringList(),
  }),
})

export const ValidatorMetadataInput = builder.inputType(
  "ValidatorMetadataInput",
  {
    fields: (t) => ({
      validator: t.string(),
      version: t.string(),
    }),
  },
)

export const SubjectMetadataInput = builder.inputType(
  "SubjectMetadataInput",
  {
    fields: (t) => ({
      participantId: t.string({ required: true }),
      age: t.float(),
      sex: t.string(),
      group: t.string(),
    }),
  },
)

export const SummaryInput = builder.inputType("SummaryInput", {
  fields: (t) => ({
    id: t.id({ required: true }),
    datasetId: t.id({ required: true }),
    modalities: t.stringList(),
    secondaryModalities: t.stringList(),
    dataTypes: t.stringList(),
    sessions: t.stringList(),
    subjects: t.stringList(),
    subjectMetadata: t.field({ type: [SubjectMetadataInput] }),
    tasks: t.stringList(),
    size: t.field({ type: "BigInt", required: true }),
    totalFiles: t.int({ required: true }),
    dataProcessed: t.boolean(),
    pet: t.field({ type: SummaryPetInput }),
    validatorMetadata: t.field({ type: ValidatorMetadataInput }),
    schemaVersion: t.string(),
  }),
})

export const ValidatorIssueInput = builder.inputType("ValidatorIssueInput", {
  fields: (t) => ({
    code: t.string({ required: true }),
    subCode: t.string(),
    location: t.string(),
    severity: t.field({ type: Severity }),
    rule: t.string(),
    issueMessage: t.string(),
    affects: t.string(),
    line: t.int(),
  }),
})

export const ValidatorCodeMessageInput = builder.inputType(
  "ValidatorCodeMessageInput",
  {
    fields: (t) => ({
      code: t.string({ required: true }),
      message: t.string({ required: true }),
    }),
  },
)

export const ValidatorInput = builder.inputType("ValidatorInput", {
  fields: (t) => ({
    id: t.id({ required: true }),
    datasetId: t.id({ required: true }),
    issues: t.field({ type: [ValidatorIssueInput], required: true }),
    codeMessages: t.field({
      type: [ValidatorCodeMessageInput],
      required: true,
    }),
    validatorMetadata: t.field({
      type: ValidatorMetadataInput,
      required: true,
    }),
  }),
})

export const MetadataInput = builder.inputType("MetadataInput", {
  fields: (t) => ({
    datasetId: t.id({ required: true }),
    datasetUrl: t.string(),
    datasetName: t.string(),
    firstSnapshotCreatedAt: t.field({ type: "DateTime" }),
    latestSnapshotCreatedAt: t.field({ type: "DateTime" }),
    dxStatus: t.string(),
    tasksCompleted: t.stringList(),
    trialCount: t.int(),
    studyDesign: t.string(),
    studyDomain: t.string(),
    studyLongitudinal: t.string(),
    dataProcessed: t.boolean(),
    species: t.string(),
    associatedPaperDOI: t.string(),
    openneuroPaperDOI: t.string(),
    seniorAuthor: t.string(),
    adminUsers: t.stringList(),
    ages: t.floatList(),
    modalities: t.stringList(),
    grantFunderName: t.string(),
    grantIdentifier: t.string(),
    affirmedDefaced: t.boolean(),
    affirmedConsent: t.boolean(),
  }),
})

export const AnnexFsckInput = builder.inputType("AnnexFsckInput", {
  fields: (t) => ({
    command: t.string(),
    errorMessages: t.stringList(),
    file: t.string(),
    key: t.string(),
    note: t.string(),
    success: t.boolean(),
    dead: t.stringList(),
    missing: t.stringList(),
    untrusted: t.stringList(),
    input: t.stringList(),
  }),
})

export const ContributorInput = builder.inputType("ContributorInput", {
  fields: (t) => ({
    name: t.string(),
    givenName: t.string(),
    familyName: t.string(),
    orcid: t.string(),
    contributorType: t.string(),
    order: t.int(),
  }),
})

export const DatasetSearchInput = builder.inputType("DatasetSearchInput", {
  description: "Search input for advanced dataset search",
  fields: (t) => ({
    keywords: t.stringList(),
    modality: t.string(),
    ageRange: t.field({
      type: ["Int"],
      required: { list: false, items: false },
    }),
    subjectCountRange: t.field({
      type: ["Int"],
      required: { list: false, items: false },
    }),
    diagnosis: t.string(),
    tasks: t.stringList(),
    authors: t.stringList(),
    sex: t.string(),
    dateRange: t.string(),
    species: t.string(),
    studyStructure: t.string(),
    studyDomains: t.stringList(),
    bidsDatasetType: t.string(),
    brainInitiative: t.boolean(),
    bodyParts: t.stringList(),
    scannerManufacturers: t.stringList(),
    scannerManufacturersModelNames: t.stringList(),
    tracerNames: t.stringList(),
    tracerRadionuclides: t.stringList(),
    sortBy: t.field({ type: SearchSortOption }),
    userId: t.string({
      description: "Filter datasets by a specific user's permissions",
    }),
    publicOnly: t.boolean({ description: "Filter to only public datasets" }),
  }),
})
