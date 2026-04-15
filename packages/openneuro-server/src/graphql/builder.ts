import SchemaBuilder from "@pothos/core"
import SimpleObjectsPlugin from "@pothos/plugin-simple-objects"
import DirectivesPlugin from "@pothos/plugin-directives"

export interface UserInfo {
  id: string
  userId: string
  admin: boolean
  username?: string
  provider?: string
  providerId?: string
  blocked?: boolean
  orcidConsent?: boolean | null
  reviewer?: boolean
  exp?: string
  scopes?: string[]
  indexer?: boolean
}

export interface GraphQLContext {
  user: string
  isSuperUser: boolean
  userInfo: UserInfo
}

export const builder = new SchemaBuilder<{
  Context: GraphQLContext
  Scalars: {
    Date: { Input: string; Output: Date }
    DateTime: { Input: string; Output: Date }
    BigInt: { Input: string; Output: string }
    JSON: { Input: unknown; Output: unknown }
  }
  DefaultFieldNullability: true
}>({
  plugins: [SimpleObjectsPlugin, DirectivesPlugin],
  notStrict:
    "Pothos may not work correctly when strict mode is not enabled in tsconfig.json",
  directives: {
    useGraphQLToolsUnorderedDirectives: true,
  },
})
