import mongoose from "mongoose"
import type { Document } from "mongoose"
const { Schema, model } = mongoose

export interface KeyDocument extends Document {
  id: string
  hash: string
}

const keySchema = new Schema({
  id: String,
  hash: String,
})

const Key = model<KeyDocument>("Key", keySchema)

export default Key
