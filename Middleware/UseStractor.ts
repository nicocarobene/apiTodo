import jwt from 'jsonwebtoken'
import { SECRET_WORD } from '../src/Mongo_DB'
interface Jwt {
  username: string,
  id: string,
  iat: number,
  exp: number
}
export const UseStractor = (req: any, resp: any, next: any) => {
  const { authorization } = req.headers
  let token = null
  if (authorization?.toLowerCase().startsWith('bearer')) {
    token = authorization.substring(7)
  }
  const decodedToken: Jwt = jwt.verify(token, SECRET_WORD) as Jwt

  if (!token || !decodedToken) {
    return resp.status(401).json({ error: 'somesing' })
  }
  req.username = decodedToken.username
  next()
}
