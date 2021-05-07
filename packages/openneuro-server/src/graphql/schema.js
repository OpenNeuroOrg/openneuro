// @ts-nocheck
import { schemaComposer } from 'graphql-compose'
import resolvers from './resolvers'
import Subscription from './resolvers/subscriptions.js'
import datasetSearch from './resolvers/dataset-search'
import { readFileSync } from 'fs'

const typeDefs = readFileSync('./schema.graphql').toString('utf-8')

schemaComposer.addTypeDefs(typeDefs)
schemaComposer.addResolveMethods(resolvers)
schemaComposer.Subscription.addFields(Subscription)
schemaComposer.Query.addFields(datasetSearch)

export default schemaComposer.buildSchema()
