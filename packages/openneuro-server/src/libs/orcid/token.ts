/**
 * Storage and retrieval of the per user ORCID OAuth tokens needed to write to a
 * user's ORCID record.
 *
 * Tokens are encrypted at rest with the same key used for other stored OAuth
 * credentials.
 */
import * as Sentry from "@sentry/node"
import config from "../../config"
import { decrypt, encrypt } from "../authentication/crypto"
import User from "../../models/user"
import type { UserDocument } from "../../models/user"

/** Scope required to add or update works on a record */
export const ACTIVITIES_UPDATE_SCOPE = "/activities/update"

/**
 * Raised when a user has no usable ORCID token so callers can tell this apart
 * from a transient ORCID API failure and prompt for re-authorization.
 */
export class OrcidAuthorizationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "OrcidAuthorizationError"
  }
}

/**
 * OAuth base URL for ORCID, which differs between sandbox and production.
 *
 * passport-orcid derives this from a sandbox flag, we derive it from the
 * configured API endpoint so only one variable has to be set.
 */
export const orcidOauthUrl = (): string => {
  if (config.auth.orcid.URI) return config.auth.orcid.URI
  return config.auth.orcid.apiURI?.includes("sandbox")
    ? "https://sandbox.orcid.org"
    : "https://orcid.org"
}

/**
 * Token fields to persist on a user from an ORCID OAuth token response.
 *
 * passport-oauth2 hands the raw token response to the verify callback as
 * `params`, which for ORCID carries the granted scope and expiration alongside
 * the tokens.
 */
export const orcidTokenFields = (params: {
  access_token?: string
  refresh_token?: string
  expires_in?: number
  scope?: string
}): Partial<UserDocument> => {
  if (!params?.access_token) return {}
  return {
    orcidAccessToken: encrypt(params.access_token),
    ...(params.refresh_token
      ? { orcidRefreshToken: encrypt(params.refresh_token) }
      : {}),
    ...(params.expires_in
      ? { orcidTokenExpires: new Date(Date.now() + params.expires_in * 1000) }
      : {}),
    ...(params.scope ? { orcidScope: params.scope } : {}),
  } as Partial<UserDocument>
}

/**
 * Exchange a refresh token for a new access token.
 */
const refreshAccessToken = async (
  refreshToken: string,
): Promise<{
  access_token: string
  refresh_token?: string
  expires_in?: number
  scope?: string
}> => {
  const form = new URLSearchParams({
    client_id: config.auth.orcid.clientID,
    client_secret: config.auth.orcid.clientSecret,
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  })
  const response = await fetch(`${orcidOauthUrl()}/oauth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json",
    },
    body: form,
  })
  const body = await response.json()
  if (!response.ok || !body.access_token) {
    throw new OrcidAuthorizationError(
      body.error_description ||
        `Could not refresh the ORCID access token (${response.status})`,
    )
  }
  return body
}

/**
 * Return an access token usable for writing to this user's ORCID record,
 * refreshing it first if it has expired.
 *
 * @throws {OrcidAuthorizationError} when the user must authorize with ORCID again
 */
export const getOrcidAccessToken = async (
  user: UserDocument,
): Promise<string> => {
  if (!user.orcidAccessToken) {
    throw new OrcidAuthorizationError(
      "No ORCID authorization is stored for this account. Sign in with ORCID again to grant access.",
    )
  }
  if (
    user.orcidScope && !user.orcidScope.includes(ACTIVITIES_UPDATE_SCOPE)
  ) {
    throw new OrcidAuthorizationError(
      "The stored ORCID authorization cannot update your record. Sign in with ORCID again to grant access.",
    )
  }

  const expired = user.orcidTokenExpires &&
    user.orcidTokenExpires.getTime() <= Date.now()
  if (!expired) {
    return decrypt(user.orcidAccessToken)
  }

  if (!user.orcidRefreshToken) {
    throw new OrcidAuthorizationError(
      "Your ORCID authorization has expired. Sign in with ORCID again to grant access.",
    )
  }

  try {
    const refreshed = await refreshAccessToken(decrypt(user.orcidRefreshToken))
    await User.updateOne({ id: user.id }, orcidTokenFields(refreshed))
    return refreshed.access_token
  } catch (err) {
    if (err instanceof OrcidAuthorizationError) throw err
    Sentry.captureException(err)
    throw new OrcidAuthorizationError(
      "Your ORCID authorization could not be refreshed. Sign in with ORCID again to grant access.",
    )
  }
}
