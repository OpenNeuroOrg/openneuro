import mongoose from 'mongoose'

const userSchema = {
  id: 'string',
  email: 'string',
  firstName: 'string',
  lastName: 'string',
  provider: 'string', // Login provider
}

const User = mongoose.model('User', userSchema)

export default User
