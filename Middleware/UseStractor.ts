import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

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
  const decodedToken: Jwt = jwt.verify(token, process.env.SECRET_WORD as string) as Jwt

  if (!token || !decodedToken) {
    return resp.status(401).json({ error: 'somesing' })
  }
  req.username = decodedToken.username
  next()
}
