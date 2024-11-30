import bcrypt from 'bcryptjs'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function hashSecurityAnswer(answer: string): Promise<string> {
  return bcrypt.hash(answer.toLowerCase().trim(), 12)
}

export async function verifySecurityAnswer(answer: string, hashedAnswer: string): Promise<boolean> {
  return bcrypt.compare(answer.toLowerCase().trim(), hashedAnswer)
} 
