import type { Redis } from "ioredis"
import { createHMAC, createSHA1 } from "hash-wasm"
import { decode, encode } from "@msgpack/msgpack"

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
  const hmac = await getHMAC()
  const expires = Math.floor(Date.now() / 1000) + PRESIGN_EXPIRATION
  const url = presignV2(hmac, resolvedBucket, s3Key, versionId, expires)
  await redis.setex(key, PRESIGN_TTL, url)
  return url
}

export function presignTreeKey(treeHash: string): string {
  return `ps-tree:${treeHash}`
}

/**
 * Bulk-resolve presigned URLs for multiple trees in two pipelined Redis calls.
 * Returns a map of tree hash -> record of filename -> presigned URL.
 */
export async function getPresignedUrlsForTreesBulk(
  redis: Redis,
  requests: {
    treeHash: string
    items: {
      filename: string
      bucket: string
      s3Key: string
      versionId: string
    }[]
  }[],
): Promise<Map<string, Record<string, string>>> {
  if (requests.length === 0) return new Map()

  // Pipeline GET all tree presign caches at once
  const keys = requests.map((r) => presignTreeKey(r.treeHash))
  const pipeline = redis.pipeline()
  for (const key of keys) {
    pipeline.getBuffer(key)
  }
  const cached = await pipeline.exec()

  const result = new Map<string, Record<string, string>>()
  const missIndices: number[] = []

  for (let i = 0; i < requests.length; i++) {
    const data = cached?.[i]?.[1] as Buffer | null
    if (data) {
      result.set(requests[i].treeHash, decode(data) as Record<string, string>)
    } else {
      missIndices.push(i)
    }
  }

  if (missIndices.length > 0) {
    const hmac = await getHMAC()
    const expires = Math.floor(Date.now() / 1000) + PRESIGN_EXPIRATION

    const writePipeline = redis.pipeline()
    for (const i of missIndices) {
      const req = requests[i]
      const urlMap: Record<string, string> = {}
      for (const item of req.items) {
        urlMap[item.filename] = presignV2(
          hmac,
          resolveBucket(item.bucket),
          item.s3Key,
          item.versionId,
          expires,
        )
      }
      result.set(req.treeHash, urlMap)
      writePipeline.setex(keys[i], PRESIGN_TTL, Buffer.from(encode(urlMap)))
    }
    await writePipeline.exec()
  }

  return result
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
