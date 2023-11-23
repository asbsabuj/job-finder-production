import { UnAuthenticatedError } from "../errors/index.js"
import jwt from "jsonwebtoken"

const auth = async (req, res, next) => {
  const token = req.cookies.token
  if (!token) {
    throw new UnAuthenticatedError("Authentication Error!")
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const testUser = payload.userId === "655b9a8daa78bb8b2e8f602f"
    req.user = { userId: payload.userId, testUser }
    next()
  } catch (error) {
    throw new UnAuthenticatedError("Authentication Invalid")
  }
}

export default auth
