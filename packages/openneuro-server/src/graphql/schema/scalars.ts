import { builder } from "../builder"
import { GraphQLDate, GraphQLDateTime } from "graphql-iso-date"
import GraphQLBigInt from "graphql-bigint"
import GraphQLJSON from "graphql-type-json"

builder.addScalarType("Date", GraphQLDate)
builder.addScalarType("DateTime", GraphQLDateTime)
builder.addScalarType("BigInt", GraphQLBigInt)
builder.addScalarType("JSON", GraphQLJSON)
