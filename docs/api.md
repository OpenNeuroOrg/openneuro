---
name: GraphQL API
route: /api
---

# API Examples

## GraphQL Playground

If you visit the [OpenNeuro API endpoint](https://openneuro.org/crn/graphql) in a browser, you can write queries with an interactive tool. This will automatically use your OpenNeuro account for authentication if you have recently authenticated with OpenNeuro on the web.

## GraphQL basics

A basic introduction to GraphQL can be found in the [official documentation](https://graphql.org/learn/).

GraphQL divides operations into queries, mutations, and a few more rarely used types like subscriptions. A query will return the same result if repeated, mutations will take some action that will be reflected in future queries.

OpenNeuro has several top level types with many fields available to query. Most information is available under the Dataset and Snapshot types.

## Example Queries

### Query dataset information

For a specific dataset you can query fields available for the draft or snapshots programmically.

```graphql
query {
  dataset(id: "ds000224") {
    id
    name
  }
}
```

Result:

```json
{
  "data": {
    "dataset": {
      "id": "ds000224",
      "name": "The Midnight Scan Club (MSC) dataset"
    }
  }
}
```

Root level fields for datasets are either top level metadata (does not belong to any draft or snapshot) or automatically determined from the most recent snapshot (such as the dataset name in this example).

To obtain this information from a particular snapshot, snapshots can be queried in several ways. This example gets the DatasetDOI field from dataset_description.json as of the 1.0.1 snapshot.

```graphql
query {
  snapshot(datasetId: "ds000224", tag: "1.0.1") {
    id
    tag
    description {
      Name
      DatasetDOI
    }
  }
}
```

```json
{
  "data": {
    "snapshot": {
      "id": "ds000224:1.0.1",
      "tag": "1.0.1",
      "description": {
        "Name": "The Midnight Scan Club (MSC) dataset",
        "DatasetDOI": "10.18112/openneuro.ds000224.v1.0.1"
      }
    }
  }
}
```

### Obtain dataset file trees

File trees are represented as git tree objects. There is a root tree for each version (commit or tag) that can be obtained by requesting the default file listing.

```graphql
query snapshotFiles {
  snapshot(datasetId: "ds000001", tag: "1.0.0") {
    files {
      id
      key
      filename
      size
      directory
      annexed
    }
  }
}
```

This will return a listing of files at the top level of the dataset.

```json
{
  "data": {
    "snapshot": {
      "files": [
        {
          "id": "92e695a42470f48ad581ac8dd0894c07ebc4a9b8",
          "key": "87b0d1e84b52af82a50100edc269f5c24e4caba5",
          "filename": "CHANGES",
          "size": 273,
          "directory": false,
          "annexed": false
        },
        {
          "id": "c1905b369e84cbb3016022ebf1ea1574087e20c2",
          "key": "d8ced4c2adedad6d69c264f94a71df6be20a2241",
          "filename": "README",
          "size": 807,
          "directory": false,
          "annexed": false
        },
        {
          "id": "7293821ae8d5c647351cb2a31484162097a442c4",
          "key": "8f6598628c1e0938397e9a3994ba71416a674f9b",
          "filename": "dataset_description.json",
          "size": 150,
          "directory": false,
          "annexed": false
        },
        {
          "id": "10834f1acb4897eaed5b29fc642718451100721b",
          "key": null,
          "filename": "sub-01",
          "size": 0,
          "directory": true,
          "annexed": false
        }
      ]
    }
  }
}
```

In this example, you can see that sub-01 has the `"directory": true`. This means the directory `id` field can be used to retrieve additional trees.

```graphql
query snapshotFiles {
  snapshot(datasetId: "ds000001", tag: "1.0.0") {
    files(tree: "10834f1acb4897eaed5b29fc642718451100721b") {
      id
      key
      filename
      size
      directory
      annexed
    }
  }
}
```

This will return any files below sub-01 in the tree for this version.

```json
{
  "data": {
    "snapshot": {
      "files": [
        {
          "id": "c63eeb1e0f41fea629f34269025f9d8225a2f3ff",
          "key": null,
          "filename": "anat",
          "size": 0,
          "directory": true,
          "annexed": false
        },
        {
          "id": "309cd8eae8896096c8734b024ac52be4743c9f44",
          "key": null,
          "filename": "func",
          "size": 0,
          "directory": true,
          "annexed": false
        }
      ]
    }
  }
}
```

The full tree can be retrieved by recursively following tree objects.

## Example Mutations

### Snapshot Creation

You can create a snapshot of the current draft with a mutation. Each argument provided in the changes array will become a line in the CHANGES file entry for this new snapshot.

```graphql
mutation {
  createSnapshot(
    datasetId: "ds000001"
    tag: "1.2.0"
    changes: ["Added new subject", "Subject metadata corrections"]
  ) {
    id
  }
}
```

### Deleting Files/Folders

You can remove files or folders from the currend draft with the `deleteFiles` mutation. Multiple
arguments can be provided in the changes array for batch deletion of paths. Paths provided in 
argument are relative to the dataset root, ommiting a filename a with `""` will delete the folder
provided via the path argument. For examples see below:

To remove a single file specify the path with respect to the dataset root.

```graphql
mutation {
  deleteFiles(datasetId: "ds000001", files: [
    {path: "sub-01", filename: "sub-01_recording-shouldnt-have-made-it-here.json"}
  ])
}
```

To remove an entire folder use `""` for the `filename` argument:

```graphql
mutation {
  deleteFiles(datasetId: "ds000001", files: [
    {path: "deravitives/freesurfer/sub-01", filename: ""}
  ])
}
```

Likewise, both file and folder deletion could be performed with a single api call via:

```graphql
mutation {
  deleteFiles(datasetId: "ds000001", files: [
    {path: "sub-01", filename: "sub-01_recording-shouldnt-have-made-it-here.json"},
    {path: "deravitives/freesurfer/sub-01", filename: ""}
  ])
}
```

Changes will appear in the draft version of the dataset. 