import config from "../config"
import { Client } from "@elastic/elasticsearch"

let _client: Client | null = null

export function getElasticClient(): Client {
  if (!_client) {
    _client = new Client({
      node: config.elasticsearch.connection || "http://mock-client",
      maxRetries: 3,
    })
  }
  return _client
}

export default getElasticClient
