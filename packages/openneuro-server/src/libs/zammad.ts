import config from "../config"

export interface DiagnosticContext {
  referrer?: string
  sentryId?: string
  error?: string
  userId?: string
  userName?: string
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
 * Format diagnostic context as a clean text block for an internal note
 */
export const formatDiagnosticNote = ({
  referrer,
  sentryId,
  error,
  userId,
  userName,
}: DiagnosticContext): string | null => {
  const items = [
    referrer && `Page: ${referrer}`,
    sentryId && `Sentry ID: ${sentryId}`,
    userId && `OpenNeuro User ID: ${userId}`,
    userName && `User Name: ${userName}`,
    error && `Error:\n${error}`,
  ].filter(Boolean)

  if (items.length === 0) return null
  return items.join("\n\n")
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
 * Create a new ticket via the Zammad REST API
 */
export async function createTicket(
  params: CreateTicketParams,
): Promise<ZammadTicket> {
  const { url, token } = getZammadConfig()

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

/**
 * Add an internal note (article) to an existing Zammad ticket
 */
export async function createTicketNote(
  ticketId: number | string,
  noteBody: string,
  subject = "Diagnostic Details",
): Promise<ZammadArticle> {
  const { url, token } = getZammadConfig()

  const response = await fetch(`${url}/api/v1/ticket_articles`, {
    method: "POST",
    headers: {
      "Authorization": `Token token=${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ticket_id: ticketId,
      subject,
      body: noteBody,
      type: "note",
      internal: true,
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "")
    throw new Error(
      `Failed to create Zammad ticket note (${response.status}): ${errorBody}`,
    )
  }

  return (await response.json()) as ZammadArticle
}
