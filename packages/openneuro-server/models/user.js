import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  id: 'string',
  email: 'string',
  name: 'string',
  provider: 'string', // Login provider
})

userSchema.index({ id: 1, provider: 1 }, { unique: true })

const User = mongoose.model('User', userSchema)

export default User
