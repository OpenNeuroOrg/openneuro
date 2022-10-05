// Temporary type representing the GraphQL DatasetFile type
// TODO - Derive this from the GraphQL schema
export interface DatasetFile {
  id: string
  key?: string
  filename: string
  size?: bigint
  annexed?: boolean
  urls?: string[]
  directory?: boolean
}
