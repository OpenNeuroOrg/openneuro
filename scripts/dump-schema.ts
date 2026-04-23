/**
 * Dump the Pothos GraphQL schema to SDL.
 */
import { writeFileSync } from "fs"
import { lexicographicSortSchema, printSchema } from "graphql/index.js"
import schema from "../packages/openneuro-server/src/graphql/schema"

const sdl = printSchema(lexicographicSortSchema(schema))
writeFileSync("schema.graphql", sdl + "\n")
