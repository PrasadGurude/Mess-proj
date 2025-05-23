import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    const users = await prisma.user.findMany({
      where: query
        ? {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { phone: { contains: query, mode: 'insensitive' } },
              { email: { contains: query, mode: 'insensitive' } },
            ],
          }
        : {},
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        avatarUrl: true,
        color: true,
        isOnline: true,
        lastSeenAt: true,
        isAdmin: true,
      },
    });

    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    console.error('[GET /api/users]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch users' },
      { status: 500 }
    );
  }
}