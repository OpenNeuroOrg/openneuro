import { builder } from "../builder"
import { DatasetConnection } from "./dataset"
import { DatasetSearchInput } from "./inputs"
import {
  advancedDatasetSearchConnection,
  datasetSearchConnection,
} from "../resolvers/dataset-search"

builder.queryFields((t) => ({
  search: t.field({
    type: DatasetConnection,
    args: {
      q: t.arg.string({ required: true }),
      after: t.arg.string(),
      first: t.arg.int(),
    },
    resolve: (root, args) => datasetSearchConnection(root, args as never),
  }),
  advancedSearch: t.field({
    type: DatasetConnection,
    args: {
      query: t.arg({ type: DatasetSearchInput, required: true }),
      allDatasets: t.arg.boolean(),
      datasetType: t.arg.string(),
      datasetStatus: t.arg.string(),
      after: t.arg.string(),
      first: t.arg.int(),
    },
    resolve: (root, args, ctx) =>
      advancedDatasetSearchConnection(root, args as never, ctx as never),
  }),
}))
