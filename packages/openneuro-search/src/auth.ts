import jwt from "jsonwebtoken"

/** Create a dataset:indexing scoped token for search indexing */
export function indexingToken(secret: string): string {
  return jwt.sign(
    {
      scopes: ["dataset:indexing"],
    },
    secret,
    { expiresIn: 60 * 60 * 3 }, // 3 hours
  )
}
