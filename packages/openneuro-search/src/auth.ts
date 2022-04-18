import jwt from 'jsonwebtoken'

/** Create a dataset:indexing scoped token for search indexing */
export function indexingToken(): string {
  return jwt.sign(
    {
      scopes: ['dataset:indexing'],
    },
    process.env.JWT_SECRET || process.env.JEST_WORKER_ID,
    { expiresIn: 60 * 60 * 3 }, // 3 hours
  )
}
