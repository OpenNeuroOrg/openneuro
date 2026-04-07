import type { Redis } from "ioredis"
import { createHMAC, createSHA1 } from "hash-wasm"

const PRESIGN_TTL = 5 * 24 * 60 * 60 // 5 days in seconds
const PRESIGN_EXPIRATION = 7 * 24 * 60 * 60 // 7 days for the presigned URL itself

const defaultBucket = process.env.AWS_S3_PUBLIC_BUCKET
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

/** Resolve bucket name, falling back to the default configured bucket */
function resolveBucket(bucket: string): string {
  return bucket || defaultBucket
}

function presignKey(bucket: string, s3Key: string, versionId: string): string {
  return `ps:${bucket}:${s3Key}:${versionId}`
}

/**
 * Pre-initialized HMAC-SHA1 signer keyed with the AWS secret.
 * hash-wasm HMAC instances are reusable after digest — call init() to reset.
 */
let hmacPromise: ReturnType<typeof createHMAC> | null = null

function getHMAC(): ReturnType<typeof createHMAC> {
  if (!hmacPromise) {
    if (!secretAccessKey) {
      throw new Error("AWS_SECRET_ACCESS_KEY is required for presigned URLs")
    }
    hmacPromise = createHMAC(
      createSHA1(),
      new TextEncoder().encode(secretAccessKey),
    )
  }
  return hmacPromise
}

/**
 * Generate a V2 query-string presigned URL for an S3 GetObject request.
 * Uses HMAC-SHA1 via hash-wasm (WASM) — orders of magnitude faster than
 * the AWS SDK's full SigV4 middleware pipeline.
 */
function presignV2(
  hmac: Awaited<ReturnType<typeof createHMAC>>,
  bucket: string,
  s3Key: string,
  versionId: string,
  expires: number,
): string {
  // StringToSign = HTTP-Verb + "\n" + "\n" + "\n" + Expires + "\n" + CanonicalizedResource
  const resource = `/${bucket}/${s3Key}?versionId=${versionId}`
  const stringToSign = `GET\n\n\n${expires}\n${resource}`
  hmac.init()
  hmac.update(stringToSign)
  const signature = Buffer.from(hmac.digest("binary")).toString("base64")
  const encodedSig = encodeURIComponent(signature)
  const encodedKey = encodeURIComponent(accessKeyId!)
  return `https://s3.amazonaws.com/${bucket}/${s3Key}?versionId=${versionId}&AWSAccessKeyId=${encodedKey}&Expires=${expires}&Signature=${encodedSig}`
}

/**
 * Get or generate a presigned URL, caching it in Redis.
 * @param bucket - S3 bucket name, or empty string for the default bucket
 */
export async function getPresignedUrl(
  redis: Redis,
  bucket: string,
  s3Key: string,
  versionId: string,
): Promise<string> {
  const resolvedBucket = resolveBucket(bucket)
  const key = presignKey(resolvedBucket, s3Key, versionId)
  const cached = await redis.get(key)
  if (cached) {
    return cached
  }
  const command = new GetObjectCommand({
    Bucket: resolvedBucket,
    Key: s3Key,
    VersionId: versionId,
  })
  const url = await getSignedUrl(s3Client, command, {
    expiresIn: PRESIGN_EXPIRATION,
  })
  await redis.setex(key, PRESIGN_TTL, url)
  return url
}

/**
 * Build a public (non-presigned) S3 URL from key and versionId.
 * @param bucket - S3 bucket name, or empty string for the default bucket
 */
export function publicS3Url(
  bucket: string,
  s3Key: string,
  versionId: string,
): string {
  return `https://s3.amazonaws.com/${
    resolveBucket(bucket)
  }/${s3Key}?versionId=${versionId}`
}
