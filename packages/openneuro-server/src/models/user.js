import uuid from 'uuid'
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  id: { type: String, default: uuid.v4 }, // OpenNeuro id
  email: String,
  name: String,
  provider: String, // Login provider
  providerId: String, // Login provider unique id
  admin: { type: Boolean, default: false },
  blocked: { type: Boolean, default: false },
  created: { type: Date, default: Date.now },
  lastSeen: { type: Date, default: Date.now },
})

userSchema.index({ id: 1, provider: 1 }, { unique: true })

const User = mongoose.model('User', userSchema)

export default User
