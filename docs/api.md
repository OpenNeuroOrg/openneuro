---
name: GraphQL API
route: api
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

### Snapshot Creation

You can create a snapshot of the current draft with a mutation. Each argument provided in the changes array will become a line in the CHANGES file entry for this new snapshot.

```graphql
mutation {
  createSnapshot(
    datasetId: "ds000001"
    tag: "1.2.0"
    changes: ["Added new subject", "Subject metadata corrections"]
  )
}
```
