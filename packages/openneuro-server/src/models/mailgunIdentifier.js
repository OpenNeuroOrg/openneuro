import mongoose from 'mongoose'

const mailgunIdentifierSchema = new mongoose.Schema({
  messageId: String,
})

const MailgunIdentifier = mongoose.model(
  'MailgunIdentifier',
  mailgunIdentifierSchema,
)

export default MailgunIdentifier
