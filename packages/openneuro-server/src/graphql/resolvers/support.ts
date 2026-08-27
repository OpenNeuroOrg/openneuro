import { createTicket, formatTicketBody } from "../../libs/zammad"
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
 * Creates a support ticket in Zammad as the customer, embedding diagnostic context in the body
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

  const fullBody = formatTicketBody(body, {
    referrer,
    sentryId,
    error,
    userId: context?.user,
    userName: name,
  })

  await createTicket({
    title,
    body: fullBody,
    email,
    name,
  })

  return true
}

export default {
  createSupportTicket,
}
