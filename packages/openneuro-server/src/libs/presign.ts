import type { Redis } from "ioredis"
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const PRESIGN_TTL = 5 * 24 * 60 * 60 // 5 days in seconds
const PRESIGN_EXPIRATION = 7 * 24 * 60 * 60 // 7 days for the presigned URL itself

const s3Client = new S3Client({})
const bucket = process.env.AWS_S3_PUBLIC_BUCKET

function presignKey(s3Key: string, versionId: string): string {
  return `ps:${s3Key}:${versionId}`
}

/** Get or generate a presigned URL, caching it in Redis */
export async function getPresignedUrl(
  redis: Redis,
  s3Key: string,
  versionId: string,
): Promise<string> {
  const key = presignKey(s3Key, versionId)
  const cached = await redis.get(key)
  if (cached) {
    return cached
  }
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: s3Key,
    VersionId: versionId,
  })
  const url = await getSignedUrl(s3Client, command, {
    expiresIn: PRESIGN_EXPIRATION,
  })
  await redis.setex(key, PRESIGN_TTL, url)
  return url
}

/** Build a public (non-presigned) S3 URL from key and versionId */
export function publicS3Url(s3Key: string, versionId: string): string {
  return `https://s3.amazonaws.com/${bucket}/${s3Key}?versionId=${versionId}`
}
