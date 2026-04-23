import { builder } from "../builder"

export const SubjectMetadata = builder.simpleObject("SubjectMetadata", {
  fields: (t) => ({
    participantId: t.string({ nullable: false }),
    age: t.float(),
    sex: t.string(),
    group: t.string(),
  }),
})

export const SummaryPetFields = builder.simpleObject("SummaryPetFields", {
  fields: (t) => ({
    BodyPart: t.stringList({ nullable: { list: true, items: true } }),
    ScannerManufacturer: t.stringList({
      nullable: { list: true, items: true },
    }),
    ScannerManufacturersModelName: t.stringList({
      nullable: { list: true, items: true },
    }),
    TracerName: t.stringList({ nullable: { list: true, items: true } }),
    TracerRadionuclide: t.stringList({ nullable: { list: true, items: true } }),
  }),
})

export const ValidatorMetadata = builder.simpleObject("ValidatorMetadata", {
  description: "BIDS Validator metadata",
  fields: (t) => ({
    validator: t.string(),
    version: t.string(),
  }),
})

export const Summary = builder.simpleObject("Summary", {
  description: "Validator summary from bids-validator",
  fields: (t) => ({
    id: t.id({ nullable: false }),
    modalities: t.stringList({ nullable: { list: true, items: true } }),
    primaryModality: t.string(),
    secondaryModalities: t.stringList({
      nullable: { list: true, items: true },
    }),
    sessions: t.stringList({ nullable: { list: true, items: true } }),
    subjects: t.stringList({ nullable: { list: true, items: true } }),
    subjectMetadata: t.field({
      type: [SubjectMetadata],
      nullable: { list: true, items: true },
    }),
    tasks: t.stringList({ nullable: { list: true, items: true } }),
    size: t.field({ type: "BigInt", nullable: false }),
    totalFiles: t.int({ nullable: false }),
    dataProcessed: t.boolean(),
    pet: t.field({ type: SummaryPetFields }),
    schemaVersion: t.string(),
    validatorMetadata: t.field({ type: ValidatorMetadata }),
  }),
})

export const Metadata = builder.simpleObject("Metadata", {
  description: "Dataset Metadata",
  fields: (t) => ({
    datasetId: t.id({ nullable: false }),
    datasetUrl: t.string(),
    datasetName: t.string(),
    firstSnapshotCreatedAt: t.field({ type: "DateTime" }),
    latestSnapshotCreatedAt: t.field({ type: "DateTime" }),
    dxStatus: t.string(),
    tasksCompleted: t.stringList({ nullable: { list: true, items: true } }),
    trialCount: t.int(),
    studyDesign: t.string(),
    studyDomain: t.string(),
    studyLongitudinal: t.string(),
    dataProcessed: t.boolean(),
    species: t.string(),
    associatedPaperDOI: t.string(),
    openneuroPaperDOI: t.string(),
    seniorAuthor: t.string(),
    adminUsers: t.stringList({ nullable: { list: true, items: true } }),
    ages: t.floatList({ nullable: { list: true, items: true } }),
    modalities: t.stringList({ nullable: { list: true, items: true } }),
    grantFunderName: t.string(),
    grantIdentifier: t.string(),
    affirmedDefaced: t.boolean(),
    affirmedConsent: t.boolean(),
  }),
})
