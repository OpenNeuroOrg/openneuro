import Reviewer from "../models/reviewer"
import { decodeJWT } from "../libs/authentication/jwt"

export const reviewerHandler = async (req, res, next) => {
  try {
    const token = req.params.token
    const decodedToken = decodeJWT(token)
    if (decodedToken?.scopes.includes("dataset:reviewer")) {
      const reviewer = await Reviewer.exists({
        id: decodedToken.sub,
        datasetId: decodedToken.dataset,
      })
      if (reviewer) {
        res
          .cookie("accessToken", token)
          .redirect(`/datasets/${decodedToken.dataset}`)
      } else {
        throw Error("Review token not valid")
      }
    } else {
      throw Error("Invalid token scope for reviewer")
    }
  } catch (err) {
    res.status(401)
    next(err)
  }
}
