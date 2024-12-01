import * as jose from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY)

export async function signJWT(payload: Record<string, unknown>) {
  const jwt = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret)

  return jwt
}

export const verifyJWT = async (token: string): Promise<Record<string, unknown> | null> => {
  try {
    const { payload } = await jose.jwtVerify(token, secret)
    return payload as Record<string, unknown>
  } catch {
    return null
  }
}
