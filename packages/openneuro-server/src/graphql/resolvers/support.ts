import { createTicket, formatTicketBody } from "../../libs/zammad"
import type { GraphQLContext } from "../builder"
import User from "../../models/user"

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
 * Creates a support ticket in Zammad as the customer, embedding diagnostic context and direct links in the body
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

  let userOrcid: string | undefined
  if (context?.user) {
    try {
      const user = await User.findOne({ id: context.user }).exec()
      if (user?.orcid) {
        userOrcid = user.orcid
      }
    } catch {
      // Continue without userOrcid if database lookup fails
    }
  }

  const fullBody = formatTicketBody(body, {
    referrer,
    sentryId,
    error,
    userId: context?.user,
    userName: name,
    userOrcid,
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
