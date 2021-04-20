import mongoose, { Document } from 'mongoose'
const { Schema, model } = mongoose

export interface MailgunIdentifierDocument extends Document {
  messageId: string
}

const mailgunIdentifierSchema = new Schema({
  messageId: String,
})

const MailgunIdentifier = model<MailgunIdentifierDocument>(
  'MailgunIdentifier',
  mailgunIdentifierSchema,
)

export default MailgunIdentifier
