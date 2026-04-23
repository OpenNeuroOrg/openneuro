import { builder } from "../builder"

export const WorkerTask = builder.simpleObject("WorkerTask", {
  fields: (t) => ({
    id: t.id({ nullable: false }),
    args: t.field({ type: "JSON" }),
    kwargs: t.field({ type: "JSON" }),
    taskName: t.string(),
    worker: t.string(),
    queuedAt: t.field({ type: "DateTime" }),
    startedAt: t.field({ type: "DateTime" }),
    finishedAt: t.field({ type: "DateTime" }),
    error: t.string(),
    executionTime: t.int(),
  }),
})
