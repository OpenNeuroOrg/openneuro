import mongoose from 'mongoose'

const keySchema = new mongoose.Schema({
  id: String,
  hash: String,
})

const Key = mongoose.model('Key', keySchema)

export default Key
