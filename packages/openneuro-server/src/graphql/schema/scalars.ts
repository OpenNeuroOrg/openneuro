import { builder } from "../builder"
import { GraphQLDate, GraphQLDateTime, GraphQLTime } from "graphql-iso-date"
import GraphQLBigInt from "graphql-bigint"
import GraphQLJSON from "graphql-type-json"

builder.addScalarType("Date", GraphQLDate)
builder.addScalarType("DateTime", GraphQLDateTime)
builder.addScalarType("Time", GraphQLTime)
builder.addScalarType("BigInt", GraphQLBigInt)
builder.addScalarType("JSON", GraphQLJSON)
