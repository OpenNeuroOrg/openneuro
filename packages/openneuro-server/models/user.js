import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  id: String,
  email: String,
  name: String,
  provider: String, // Login provider
  admin: { type: Boolean, default: false },
  blacklist: { type: Boolean, default: false },
})

userSchema.index({ id: 1, provider: 1 }, { unique: true })

const User = mongoose.model('User', userSchema)

export default User
