import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt } from './jwt';
import jwt from 'jsonwebtoken';

export function getAuthUser(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.split(' ')[1];
  if (!token) return null;
  try {
    return verifyJwt(token);
  } catch {
    return null;
  }
}


const SECRET = process.env.JWT_SECRET!;

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET) as { id: string; name: string };
  } catch {
    return null;
  }
}