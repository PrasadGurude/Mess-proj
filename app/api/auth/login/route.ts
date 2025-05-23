import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { signJwt } from '@/lib/jwt';

export async function POST(req: NextRequest) {
  const { emailorPhone, password } = await req.json();

  // Find user by phone or email
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { phone: emailorPhone || undefined },
        { email: emailorPhone || undefined }
      ]
    }
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = signJwt({ id: user.id });
  return NextResponse.json({ user, token });
}
