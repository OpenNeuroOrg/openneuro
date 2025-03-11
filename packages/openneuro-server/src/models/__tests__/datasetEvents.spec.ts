import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import DatasetEvent, {
  DatasetEventDocument,
  DatasetEventType,
} from "../datasetEvents"
import { OpenNeuroUserId } from "../../types/user"

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

  it("should create a new DatasetEvent", async () => {
    const eventData: Partial<DatasetEventDocument> = {
      datasetId: "ds000001",
      timestamp: new Date(),
      userId: "user123" as OpenNeuroUserId,
      event: {
        type: "created",
      },
      success: true,
      note: "Dataset created successfully",
    }

    const datasetEvent = new DatasetEvent(eventData)
    const savedDatasetEvent = await datasetEvent.save()

    expect(savedDatasetEvent._id).toBeDefined()
    expect(savedDatasetEvent.datasetId).toBe("ds000001")
    expect(savedDatasetEvent.user).toBe("user123")
    expect(savedDatasetEvent.event.type).toBe("created")
    expect(savedDatasetEvent.success).toBe(true)
    expect(savedDatasetEvent.note).toBe("Dataset created successfully")
    expect(savedDatasetEvent.timestamp).toBeInstanceOf(Date)
  })

  it("should create a DatasetEvent with default values", async () => {
    const eventData: Partial<DatasetEventDocument> = {
      datasetId: "ds000002",
      timestamp: new Date(),
      userId: "user456" as OpenNeuroUserId,
      event: {
        type: "versioned",
        version: "1.0.0",
      },
    }

    const datasetEvent = new DatasetEvent(eventData)
    const savedDatasetEvent = await datasetEvent.save()

    expect(savedDatasetEvent._id).toBeDefined()
    expect(savedDatasetEvent.success).toBe(false)
    expect(savedDatasetEvent.note).toBe("")
  })

  it("should require datasetId, timestamp, user, and event", async () => {
    const eventData = {}

    const datasetEvent = new DatasetEvent(eventData)

    await expect(datasetEvent.save()).rejects.toThrow()
  })

  it("should handle different event types", async () => {
    const events: DatasetEventType[] = [
      { type: "created" },
      { type: "versioned", version: "1.0.0" },
      { type: "deleted" },
      { type: "published", public: true },
      {
        type: "permissionChange",
        target: "user789" as OpenNeuroUserId,
        level: "admin",
      },
      { type: "git", ref: "main", message: "Initial commit" },
      { type: "upload" },
      { type: "note", admin: false },
    ]

    for (const event of events) {
      const eventData: Partial<DatasetEventDocument> = {
        datasetId: "ds000003",
        timestamp: new Date(),
        userId: "user101" as OpenNeuroUserId,
        event: event,
        success: true,
        note: "Testing different event types",
      }
      const datasetEvent = new DatasetEvent(eventData)
      const savedDatasetEvent = await datasetEvent.save()
      expect(savedDatasetEvent.event.type).toBe(event.type)
    }
  })
})
