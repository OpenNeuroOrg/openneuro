import crypto from 'crypto'

const secret = 'notsosecret'
const algorithm = 'aes256'
const key = crypto
  .createHash('sha256')
  .update(secret)
  .digest('base64')
  .substr(0, 32)

export const encrypt = (plainText) => {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(algorithm, key, iv)
  const encryptedText =
    cipher.update(plainText, 'utf8', 'hex') + cipher.final('hex')
  const encryptedPackage = pack(iv, encryptedText)
  return encryptedPackage
}

export const decrypt = (encryptedPackage) => {
  const [iv, encryptedText] = unpack(encryptedPackage)
  const decipher = crypto.createDecipheriv(algorithm, key, iv)
  const decryptedText =
    decipher.update(encryptedText, 'hex', 'utf8') + decipher.final('utf8')
  return decryptedText
}

const delimiter = '.'
const encoding = 'base64'

const pack = (iv, encrypted) => iv.toString(encoding) + delimiter + encrypted

const unpack = (encryptedPackage) => {
  const [strIv, encrypted] = encryptedPackage.split(delimiter)
  const iv = Buffer.from(strIv, encoding)
  return [iv, encrypted]
}
