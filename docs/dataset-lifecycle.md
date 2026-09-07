---
name: Dataset Lifecycle
route: /dataset-lifecycle
---

# Dataset Lifecycle

Datasets are git/git-annex repositories managed by datalad-service. This
document describes the states a dataset, its snapshots, and their DOIs
pass through, and the mutations that drive transitions between them.

## Dataset states

A dataset's state is determined by two fields: whether it has any
snapshots and whether it is public.

```{mermaid}
stateDiagram-v2
    [*] --> Draft
    Draft --> Embargoed : createSnapshot()
    Embargoed --> Public : publishDataset()
    Public --> Embargoed : updatePublic(false) [admin]
    Draft --> Deleted : deleteDataset()
    Embargoed --> Deleted : deleteDataset()
    Public --> Deleted : deleteDataset()
```

| State         | Determination        | DB representation                                  |
| ------------- | -------------------- | -------------------------------------------------- |
| **Draft**     | Unversioned, private | `Dataset.public = false`, no `Snapshot` docs exist |
| **Embargoed** | Versioned, private   | `Dataset.public = false`, ≥1 `Snapshot` doc exists |
| **Public**    | Versioned, public    | `Dataset.public = true`, `Dataset.publishDate` set |
| **Deleted**   | Dataset removed      | `Deletion` doc created                             |

These states are implicit — there is no `Dataset.status` field. The code
does not use the term "embargoed"; both Draft and Embargoed datasets have
`public = false` and are distinguished only by the presence of snapshots.

**Key constraints:**

- Draft → Embargoed is irreversible. Once a snapshot exists, the dataset
  cannot return to Draft.
- Public → Embargoed requires admin privileges.

### Creation

`createDataset()` creates a new `Dataset` document with `public: false`
and fires a `{ type: "created" }` event.

- **JS:** `packages/openneuro-server/src/datalad/dataset.ts`

### Snapshotting (Draft → Embargoed, or new version)

`createSnapshot()` tags the current HEAD as a new version. The first
snapshot transitions the dataset from Draft to Embargoed. Subsequent
snapshots do not change the dataset state.

- **JS:** `packages/openneuro-server/src/datalad/snapshots.ts`
- **Python:** `services/datalad/datalad_service/tasks/snapshots.py`
- **Event:** `{ type: "versioned", version: tag }`

**Sequence:**

1. Acquire distributed lock (`lockSnapshot()`, 30-min TTL)
2. Create `"versioned"` event
3. Mint DOI via DataCite MDS API (`createIfNotExistsDoi()`)
   — format: `doi:{prefix}/openneuro.{datasetId}.v{tag}`
4. Update `dataset_description.json` with `DatasetDOI` field
5. Update `CHANGES` file with version and changelog entries
6. POST to datalad-service to create git tag
7. Store `Snapshot` document in MongoDB
8. Clear Redis caches
9. Queue for Elasticsearch indexing
10. Notify dataset followers

**Preconditions:** BIDS validation and git-annex fsck should pass before
creating a snapshot. This is currently enforced in the UI, not in the
`createSnapshot()` API.

### Publishing (Embargoed → Public)

`publishDataset()` sets `Dataset.public = true` and triggers export to
S3 and GitHub.

- **JS resolver:** `packages/openneuro-server/src/graphql/resolvers/publish.ts`
- **JS function:** `packages/openneuro-server/src/datalad/dataset.ts` — `updatePublic()`
- **Python task:** `services/datalad/datalad_service/tasks/publish.py`
- **Event:** `{ type: "published", public: true }`

**Sequence:**

1. Check write permissions
2. Set `Dataset.public = true` and `Dataset.publishDate = new Date()`
3. Create `"published"` event
4. POST to datalad-service `/datasets/{id}/publish`
5. Create S3 and GitHub remotes (`create_remotes_and_export()`)
6. Export dataset to S3-PUBLIC and GitHub (`export_dataset()`)
7. Set S3 access tags to "public"
8. Run remote fsck to verify exported data
9. Drop local annexed files after verification

### Re-embargo (Public → Embargoed)

`updatePublic(datasetId, false, user)` sets `Dataset.public = false` and
updates S3 access tags to "private".

- **JS:** `packages/openneuro-server/src/datalad/dataset.ts` — `updatePublic()`
- **Event:** `{ type: "published", public: false }`

**Known issue:** This also sets `Dataset.publishDate = new Date()` rather
than clearing it.

### Deletion

`deleteDataset()` removes the dataset from the git backend and
Elasticsearch. Currently, datasets with snapshots require admin action to
delete.

- **JS:** `packages/openneuro-server/src/datalad/dataset.ts` — `deleteDataset()`
- **Event:** `{ type: "deleted" }`
- Creates a `Deletion` document (datasetId, user, reason, optional
  redirect URL)

## Snapshot status

Snapshots can be independently deprecated without changing the dataset's
state.

```{mermaid}
stateDiagram-v2
    [*] --> Active : createSnapshot()
    Active --> Deprecated : deprecateSnapshot()
    Deprecated --> Active : undoDeprecateSnapshot()
```

| Status         | DB representation                                           |
| -------------- | ----------------------------------------------------------- |
| **Active**     | `Snapshot` doc exists, no matching `DeprecatedSnapshot` doc |
| **Deprecated** | `DeprecatedSnapshot` doc with user, reason, timestamp       |

- **JS:** `packages/openneuro-server/src/graphql/resolvers/snapshots.ts`

## DOI assignment

Each snapshot is assigned a DOI via the DataCite MDS API at creation
time. DOIs are minted immediately as findable — there is no state
management after creation.

| Field   | Value                                       |
| ------- | ------------------------------------------- |
| Format  | `doi:{prefix}/openneuro.{datasetId}.v{tag}` |
| API     | DataCite MDS (XML metadata + `PUT /doi`)    |
| Created | During `createSnapshot()` (step 3)          |
| State   | Not tracked locally                         |

- **JS:** `packages/openneuro-server/src/libs/doi/index.ts`
- **Handler:** `packages/openneuro-server/src/handlers/doi.ts`
- **Model:** `packages/openneuro-server/src/models/doi.ts`
  — fields: `datasetId`, `snapshotId`, `doi`

DOI metadata includes creators, title, publisher ("Openneuro"),
publication year, and resource type. The DOI string is written into
`dataset_description.json` before the git tag is created.

DOI state is never updated after creation. The DOI remains findable at
DataCite regardless of whether the dataset is later re-embargoed, the
snapshot is deprecated, or the dataset is deleted.

## Working tree

The working tree (git HEAD) can diverge from the latest snapshot when
users upload or edit files. Draft datasets are always diverged (no
snapshot exists). For Embargoed and Public datasets:

| Status       | Determination                   |
| ------------ | ------------------------------- |
| **Clean**    | `HEAD == latestSnapshot.hexsha` |
| **Diverged** | `HEAD != latestSnapshot.hexsha` |

Divergence does not change the dataset's lifecycle state. A new
`createSnapshot()` call is required to tag the current HEAD.

- **JS:** `packages/openneuro-server/src/datalad/draft.ts`
  — `getDraftRevision()`, `getDraftInfo()`, `resetDraft()`

### Data retention

When the working tree diverges from the latest snapshot, a notification
schedule enforces data retention:

- 14 days diverged: first warning email
- 21 days: second warning
- 28 days: deletion notice
- No snapshot within 24h of first upload: one-time reminder

- **JS:** `packages/openneuro-server/src/datalad/dataRetentionNotifications.ts`

## Validation

Validation is a precondition for snapshotting, not a persistent state.
Two checks are involved:

### BIDS schema validation

Runs the BIDS validator (deno-based, v2.3.2) against a specific commit.

- **JS resolver:** `packages/openneuro-server/src/graphql/resolvers/validation.ts` — `revalidate()`
- **Python task:** `services/datalad/datalad_service/tasks/validator.py` — `validate_dataset()`
- **Storage:** `Validation` collection

### git-annex fsck

Checks data consistency of annexed files.

- **JS resolver:** `packages/openneuro-server/src/graphql/resolvers/fileCheck.ts` — `fsckDataset()`
- **Python task:** `services/datalad/datalad_service/tasks/fsck.py` — `git_annex_fsck_local()`
- Runs `git-annex fsck -J4` with incremental 45-day schedule
- **Storage:** `FileCheck` collection

## Data model reference

### MongoDB collections

| Collection           | File                                        | Key fields                                     |
| -------------------- | ------------------------------------------- | ---------------------------------------------- |
| `Dataset`            | `packages/.../models/dataset.ts`            | `id, public, publishDate, created, modified`   |
| `Snapshot`           | `packages/.../models/snapshot.ts`           | `datasetId, tag, hexsha, created`              |
| `DeprecatedSnapshot` | `packages/.../models/deprecatedSnapshot.ts` | `id, user, reason, timestamp`                  |
| `DatasetEvent`       | `packages/.../models/datasetEvents.ts`      | `datasetId, userId, event, success, timestamp` |
| `Doi`                | `packages/.../models/doi.ts`                | `datasetId, snapshotId, doi`                   |
| `Validation`         | `packages/.../models/validation.ts`         | `id (ref), datasetId, issues, codeMessages`    |
| `FileCheck`          | `packages/.../models/fileCheck.ts`          | `datasetId, hexsha, refs, annexFsck[]`         |
| `Deletion`           | `packages/.../models/deletion.ts`           | `datasetId, user, reason, redirect`            |

All model files are under `packages/openneuro-server/src/models/`.

### GraphQL types

Defined in `packages/openneuro-server/src/graphql/schema.ts`:

- `Dataset` — core entity with `public`, `publishDate`, `draft`, `snapshots`
- `Draft` — working tree with `modified`, `summary`, `validation`, `fileCheck`
- `Snapshot` — tagged version with `tag`, `hexsha`, `deprecated`
- `DeprecatedSnapshot` — deprecation record
- `DatasetValidation` — validation results with error/warning counts

### Mutations

| Mutation                | Effect                                              |
| ----------------------- | --------------------------------------------------- |
| `createDataset`         | Creates dataset in Draft state                      |
| `createSnapshot`        | Creates snapshot + DOI; Draft → Embargoed on first  |
| `publishDataset`        | Embargoed → Public; exports to S3/GitHub            |
| `updatePublic(false)`   | Public → Embargoed (admin only)                     |
| `deprecateSnapshot`     | Marks a snapshot as deprecated                      |
| `undoDeprecateSnapshot` | Removes deprecation                                 |
| `deleteDataset`         | Removes dataset (admin required if snapshots exist) |
| `fsckDataset`           | Triggers git-annex fsck                             |
| `revalidate`            | Triggers BIDS validation                            |

### Event types

Dataset events are stored in the `DatasetEvent` collection and track all
state transitions:

`created` · `versioned` · `deleted` · `published` · `permissionChange` ·
`git` · `upload` · `note` · `contributorRequest` · `contributorCitation` ·
`contributorRequestResponse` · `contributorCitationResponse`
