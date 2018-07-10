import mongoose from 'mongoose'

const migrationSchema = new mongoose.Schema({
  id: String,
  complete: { type: Boolean, default: false },
})

const Migration = mongoose.model('Migration', migrationSchema)

export default Migration
