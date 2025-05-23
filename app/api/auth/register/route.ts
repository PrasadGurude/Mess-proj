import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { signJwt } from '@/lib/jwt';

export async function POST(req: NextRequest) {
  try {
    const { name, phone, password, email, color } = await req.json();

    if (!name || !phone || !password || !color) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { phone } });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this phone number' },
        { status: 409 }
      );
    }
    const existingUseremail = await prisma.user.findUnique({ where: { email } });
    if (existingUseremail) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        phone,
        email,
        color,
        password: hashedPassword,
      },
    });

    const token = signJwt({ id: user.id });

    return NextResponse.json({ user, token });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
