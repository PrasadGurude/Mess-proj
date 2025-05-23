import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  avatarUrl: z.string().url().optional(),
  color: z.string().optional(),
  isOnline: z.boolean().optional(),
  lastSeenAt: z.coerce.date().optional(), // handles ISO strings too
});

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    const body = await req.json();

    // Validate input
    const data = updateUserSchema.parse(body);

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatarUrl: true,
        color: true,
        isOnline: true,
        lastSeenAt: true,
        isAdmin: true,
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error('[PUT /api/users/[id]]', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to update profile',
      },
      { status: 500 }
    );
  }
}
