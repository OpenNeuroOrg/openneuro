import mongoose, { Document } from 'mongoose'
const { Schema, model } = mongoose

export interface MigrationDocument extends Document {
  id: string
  complete: boolean
}

const migrationSchema = new Schema({
  id: String,
  complete: { type: Boolean, default: false },
})

const Migration = model<MigrationDocument>('Migration', migrationSchema)

export default Migration
