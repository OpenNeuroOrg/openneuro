// dependencies ------------------------------------------------------------
import * as Sentry from "@sentry/node"
import { generateApiKey } from "../libs/apikey"
import jwt from "jsonwebtoken"
import config from "../config"
import { v4 as uuidv4 } from "uuid"
// handlers ----------------------------------------------------------------

/**
 * Users
 *
 * Handlers for user actions.
 */
export function createAPIKey(req, res, next) {
  generateApiKey(req.user)
    .then((key) => res.send(key))
    .catch((err) => next(err))
}
export const generateCoralSSOToken = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const payload = {
      jti: uuidv4(),
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (60 * 60),
      user: {
        id: req.user.id,
        email: req.user.email,
        username: req.user.name,
      },
    }

    const header = {
      alg: "HS256",
    }
    const token = jwt.sign(payload, config.auth.coral.secret, { header })
    res.json({ token })
  } catch (error) {
    Sentry.captureException(error)
    res.status(500).json({ message: "Failed to generate Coral SSO token" })
  }
}
