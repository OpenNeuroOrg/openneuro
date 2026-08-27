/**
 * Client for the Zammad form channel.
 *
 * Zammad exposes an unauthenticated two step API for embedded support forms:
 * a config call trades a client fingerprint for a single use token, and the
 * submit call creates the ticket. The instance must have the form channel
 * enabled and the app's origin allowlisted for CORS.
 *
 * https://admin-docs.zammad.org/en/latest/channels/form.html
 */

/** Support inbox shown when the embedded form is unavailable */
export const SUPPORT_EMAIL = "openneuro@zammad.com"

export interface ZammadFormConfig {
  enabled: boolean
  endpoint: string
  token: string
}

export interface ZammadFormFields {
  name: string
  email: string
  title: string
  body: string
}

/** Field name to message, as returned by a rejected submission */
export type ZammadFormErrors = Record<string, string>

/**
 * Zammad requires a 32-character client fingerprint to bind the form token
 */
export const getFingerprint = (): string =>
  globalThis.crypto.randomUUID().replace(/-/g, "")

const formConfigUrl = (zammadUrl: string): string =>
  `${zammadUrl.replace(/\/+$/, "")}/api/v1/form_config`

/**
 * Obtain the submit endpoint and token for a fingerprint
 */
export async function fetchFormConfig(
  zammadUrl: string,
  fingerprint: string,
): Promise<ZammadFormConfig> {
  const response = await fetch(formConfigUrl(zammadUrl), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fingerprint }),
  })
  if (!response.ok) {
    throw new Error(`Zammad form config request failed (${response.status})`)
  }
  return await response.json() as ZammadFormConfig
}

/**
 * Create a ticket from the form fields
 * @returns Validation errors keyed by field, or null if the ticket was created
 */
export async function submitForm(
  formConfig: ZammadFormConfig,
  fingerprint: string,
  fields: ZammadFormFields,
): Promise<ZammadFormErrors | null> {
  const response = await fetch(formConfig.endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fingerprint,
      token: formConfig.token,
      ...fields,
    }),
  })
  // Zammad reports field validation failures in the body, not the status
  const body = await response.json().catch(() => null)
  if (body?.errors) {
    return body.errors as ZammadFormErrors
  }
  if (!response.ok) {
    throw new Error(`Zammad form submission failed (${response.status})`)
  }
  return null
}
