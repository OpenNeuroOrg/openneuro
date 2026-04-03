import type { Redis } from "ioredis"
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const PRESIGN_TTL = 5 * 24 * 60 * 60 // 5 days in seconds
const PRESIGN_EXPIRATION = 7 * 24 * 60 * 60 // 7 days for the presigned URL itself

const s3Client = new S3Client({})
const defaultBucket = process.env.AWS_S3_PUBLIC_BUCKET

/** Resolve bucket name, falling back to the default configured bucket */
function resolveBucket(bucket: string): string {
  return bucket || defaultBucket
}

function presignKey(bucket: string, s3Key: string, versionId: string): string {
  return `ps:${bucket}:${s3Key}:${versionId}`
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
