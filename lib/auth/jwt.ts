import * as jose from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY)

export async function signJWT(payload: any) {
  const jwt = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret)

  return jwt
}

export async function verifyJWT<T>(token: string): Promise<T> {
  try {
    const { payload } = await jose.jwtVerify(token, secret)
    return payload as T
  } catch (error) {
    throw new Error('Invalid token')
  }
} 
