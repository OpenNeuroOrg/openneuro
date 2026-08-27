import config from "../config"

export interface DiagnosticContext {
  referrer?: string
  sentryId?: string
  error?: string
  userId?: string
  userName?: string
  userOrcid?: string
  datasetId?: string
  siteUrl?: string
}

export interface CreateTicketParams {
  title: string
  body: string
  email: string
  name?: string
  group?: string
}

export interface ZammadTicket {
  id: number
  number: string
  title: string
  [key: string]: unknown
}

export interface ZammadArticle {
  id: number
  ticket_id: number
  [key: string]: unknown
}

/**
 * Format diagnostic context as a clean text block with direct links
 */
export const formatDiagnosticNote = ({
  referrer,
  sentryId,
  error,
  userId,
  userName,
  userOrcid,
  datasetId,
  siteUrl,
}: DiagnosticContext): string | null => {
  const baseUrl = (siteUrl || config.url || "").replace(/\/+$/, "")

  let pageUrl: string | undefined
  if (referrer) {
    pageUrl = baseUrl
      ? (referrer.startsWith("http")
        ? referrer
        : `${baseUrl}${referrer.startsWith("/") ? "" : "/"}${referrer}`)
      : referrer
  }

  const dsId = datasetId || referrer?.match(/(ds\d{6})/)?.[1]
  const datasetUrl = dsId
    ? (baseUrl ? `${baseUrl}/datasets/${dsId}` : `/datasets/${dsId}`)
    : undefined

  const userUrl = userOrcid
    ? (baseUrl ? `${baseUrl}/user/${userOrcid}` : `/user/${userOrcid}`)
    : undefined

  const items = [
    pageUrl && `Page: ${pageUrl}`,
    datasetUrl && `Dataset: ${datasetUrl}`,
    userUrl && `User Profile: ${userUrl}`,
    userId && `OpenNeuro User ID: ${userId}`,
    userName && `User Name: ${userName}`,
    sentryId && `Sentry ID: ${sentryId}`,
    error && `Error:\n${error}`,
  ].filter(Boolean)

  if (items.length === 0) return null
  return items.join("\n\n")
}

/**
 * Format user message and diagnostic info into the initial ticket body
 */
export const formatTicketBody = (
  userBody: string,
  diagnostics: DiagnosticContext,
): string => {
  const diagnosticText = formatDiagnosticNote(diagnostics)
  if (!diagnosticText) {
    return userBody
  }
  return [userBody.trim(), "---", "Diagnostic Information:", diagnosticText]
    .filter(Boolean)
    .join("\n\n")
}

const getZammadConfig = () => {
  const url = config.zammad?.url?.replace(/\/+$/, "")
  const token = config.zammad?.token
  if (!url || !token) {
    throw new Error("Zammad support service is not configured")
  }
  return { url, token }
}

/**
 * Create a new ticket via the Zammad REST API as the customer
 */
export async function createTicket(
  params: CreateTicketParams,
): Promise<ZammadTicket> {
  const { url, token } = getZammadConfig()
  const from = params.name ? `${params.name} <${params.email}>` : params.email

  const response = await fetch(`${url}/api/v1/tickets`, {
    method: "POST",
    headers: {
      "Authorization": `Token token=${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: params.title,
      group: params.group || "Users",
      customer: params.email,
      article: {
        subject: params.title,
        body: params.body,
        type: "web",
        sender: "Customer",
        from,
        internal: false,
      },
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "")
    throw new Error(
      `Failed to create Zammad ticket (${response.status}): ${errorBody}`,
    )
  }

  return (await response.json()) as ZammadTicket
}
