import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import DatasetEvent, { DatasetEventTypes } from "../datasetEvents"
import { createEvent } from "../../libs/events"

describe("DatasetEvent Model", () => {
  let mongoServer: MongoMemoryServer

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    const mongoUri = mongoServer.getUri()
    await mongoose.connect(mongoUri)
  })

  afterAll(async () => {
    await mongoose.disconnect()
    await mongoServer.stop()
  })

  beforeEach(async () => {
    await DatasetEvent.deleteMany({})
  })

  it("should create a new dataset event", async () => {
    const datasetId = "ds000001"
    const type: DatasetEventTypes = "created"
    const user = "user123"
    const description = "Dataset created"
    const note = "Initial creation"

    const event = new DatasetEvent({
      datasetId,
      type,
      user,
      description,
      note,
    })

    const savedEvent = await event.save()

    expect(savedEvent.datasetId).toBe(datasetId)
    expect(savedEvent.type).toBe(type)
    expect(savedEvent.user).toBe(user)
    expect(savedEvent.description).toBe(description)
    expect(savedEvent.note).toBe(note)
    expect(savedEvent.timestamp).toBeInstanceOf(Date)
  })

  it("should create a new dataset event using createEvent helper", async () => {
    const datasetId = "ds000002"
    const type: DatasetEventTypes = "versioned"
    const user = "user456"
    const description = "Dataset versioned"
    const note = ""

    const savedEvent = await createEvent(datasetId, type, user, description)

    expect(savedEvent.datasetId).toBe(datasetId)
    expect(savedEvent.type).toBe(type)
    expect(savedEvent.user).toBe(user)
    expect(savedEvent.description).toBe(description)
    expect(savedEvent.note).toBe(note)
    expect(savedEvent.timestamp).toBeInstanceOf(Date)
  })

  it("should have a default empty description if not provided", async () => {
    const datasetId = "ds000003"
    const type: DatasetEventTypes = "deleted"
    const user = "user789"

    const event = new DatasetEvent({
      datasetId,
      type,
      user,
    })

    const savedEvent = await event.save()
    expect(savedEvent.description).toBe("")
  })

  it("should have a default empty note if not provided", async () => {
    const datasetId = "ds000004"
    const type: DatasetEventTypes = "published"
    const user = "user101112"
    const description = "Dataset published"

    const event = new DatasetEvent({
      datasetId,
      type,
      user,
      description,
    })

    const savedEvent = await event.save()
    expect(savedEvent.note).toBe("")
  })

  it("should have a default timestamp", async () => {
    const datasetId = "ds000005"
    const type: DatasetEventTypes = "permissionChange"
    const user = "user131415"
    const description = "Dataset permissions modified"

    const event = new DatasetEvent({
      datasetId,
      type,
      user,
      description,
    })

    const savedEvent = await event.save()
    expect(savedEvent.timestamp).toBeInstanceOf(Date)
  })

  it("should require datasetId, type, and user", async () => {
    const event = new DatasetEvent({})

    await expect(event.save()).rejects.toThrow()

    const eventNoType = new DatasetEvent({ datasetId: "test", user: "test" })
    await expect(eventNoType.save()).rejects.toThrow()

    const eventNoUser = new DatasetEvent({ datasetId: "test", type: "created" })
    await expect(eventNoUser.save()).rejects.toThrow()

    const eventNoDatasetId = new DatasetEvent({ type: "created", user: "test" })
    await expect(eventNoDatasetId.save()).rejects.toThrow()
  })

  it("should only accept valid types", async () => {
    const datasetId = "ds000006"
    const user = "user161718"
    const description = "Invalid event type"

    const eventInvalidType = new DatasetEvent({
      datasetId,
      type: "invalidType",
      user,
      description,
    })

    await expect(eventInvalidType.save()).rejects.toThrow()
  })
})
