import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export interface AuthPayload extends JwtPayload {
  id: string;
}

export function signJwt(payload: AuthPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyJwt(token: string): AuthPayload {
  const decoded = jwt.verify(token, JWT_SECRET);
  if (typeof decoded === 'string') {
    throw new Error('Invalid token payload');
  }
  return decoded as AuthPayload;
}
