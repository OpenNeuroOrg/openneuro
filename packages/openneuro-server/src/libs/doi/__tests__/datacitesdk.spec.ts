import config from "../../../config"
import datacite from '@api/datacite'
import { PostDoisBodyParam } from '@api/datacite'
import { updateDoi } from '../_index'

import { vi } from "vitest"
import request from "superagent"
import { createDataset } from "../../../datalad/dataset"
import { getDatasetWorker } from "../../datalad-service"
import { connect } from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"

// Mock requests to Datalad service
vi.mock("superagent")
vi.mock("ioredis")
vi.mock("../../redis")
vi.mock("../../../config.ts")
vi.mock("../../notifications")



describe("DOI minting utils using datacite SDK", () => {
  let doi = '';
  const attributes: PostDoisBodyParam = {
    "prefix": "10.24397",
    "creators": [
      {
        "name": "sfl.openneuro"
      }
    ],
    "titles": [
      {
        "title": "datacitesdk.spec.ts"
      }
    ],
    "publisher": "DataCite e.V.",
    "publicationYear": 2016,
    "types": {
      "resourceTypeGeneral": "Text"
    },
    "url": "https://notadomain.org"
  }
  it("It generates a draft doi record.", async () => {
    datacite.auth(config.doi.username, config.doi.password)
    await datacite.postDois({data: {"type": "dois", attributes}})
      .then(({ data }) => {
        doi = data["data"]["id"]
      })
      .catch((err) => {
        console.log(err)
        console.log(err.data.errors)
      });
  })
  it("It can retrieve the generated record.", async () => {
    let getDoisIdData = undefined; 
    await datacite.getDoisId({id: doi}).then(({ data }) => {
      getDoisIdData = data
    })
    .catch((err) => {
      console.log(err)
      console.log(err.data)
    });
    expect(getDoisIdData["data"]["id"]).toEqual(doi)
    expect(getDoisIdData["data"]["url"]).toEqual(attributes["url"])
  })
  it("It can delete the generated record.", async () => {
    await datacite.deleteDoisId({id: doi}).then(({ status }) => {
        expect(status).toEqual(204)
      })
      .catch((err) => {
        console.log(err)
        console.log(err.data)
      });
  })
}, 4000)

describe("DOI minting and snapshot integration", () => {
  describe("createDataset()", () => {
    let mongod
    beforeAll(async () => {
      // Setup MongoDB with mongodb-memory-server
      mongod = await MongoMemoryServer.create()
      connect(mongod.getUri())
    })
    it("resolves to dataset id string", async () => {
      const user = { id: "1234" }
      const { id: dsId } = await createDataset(user.id, user, {
        affirmedDefaced: true,
        affirmedConsent: true,
      })
      expect(dsId).toHaveLength(8)
      expect(dsId.slice(0, 2)).toBe("ds")
    })
    it("posts to the DataLad /datasets/{dsId} endpoint", async () => {
      const user = { id: "1234" }
      // Reset call count for request.post
      request.post.mockClear()
      const { id: dsId } = await createDataset(user.id, user, {
        affirmedDefaced: true,
        affirmedConsent: true,
      })
      expect(request.post).toHaveBeenCalledTimes(1)
      expect(request.post).toHaveBeenCalledWith(
      expect.stringContaining(`${getDatasetWorker(dsId)}/datasets/`),
      )
    })
  })
})
