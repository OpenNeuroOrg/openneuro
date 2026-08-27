import {
  createTicket,
  createTicketNote,
  formatDiagnosticNote,
} from "../../libs/zammad"
import type { GraphQLContext } from "../builder"

export interface CreateSupportTicketArgs {
  name?: string
  email: string
  title: string
  body: string
  error?: string
  sentryId?: string
  referrer?: string
}

/**
 * Creates a support ticket in Zammad, optionally attaching diagnostic context as an internal note
 */
export async function createSupportTicket(
  _parent: unknown,
  args: CreateSupportTicketArgs,
  context?: GraphQLContext,
): Promise<boolean> {
  const { name, email, title, body, error, sentryId, referrer } = args

  if (!email || !title || !body) {
    throw new Error("Missing required support ticket fields")
  }

  // 1. Create the customer-facing ticket
  const ticket = await createTicket({
    title,
    body,
    email,
    name,
  })

  // 2. Format and attach diagnostic details as an internal note if available
  const diagnosticNote = formatDiagnosticNote({
    referrer,
    sentryId,
    error,
    userId: context?.user,
    userName: name,
  })

  if (diagnosticNote && ticket?.id) {
    await createTicketNote(ticket.id, diagnosticNote)
  }

  return true
}

export default {
  createSupportTicket,
}
