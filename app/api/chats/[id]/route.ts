
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateChatSchema = z.object({
  name: z.string().optional(),
  labels: z.array(z.string()).optional(),
  isVerified: z.boolean().optional(),
  unreadCount: z.number().int().min(0).optional(),
  status: z.boolean().optional(),
  addMembers: z.array(z.string()).optional(),
  removeMembers: z.array(z.string()).optional(),
});

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const chatId = params.id;
    const body = await req.json();
    const data = updateChatSchema.parse(body);

    // 1. Add members (skip duplicates)
    if (data.addMembers?.length) {
      const newMembers = data.addMembers.map((userId) => ({
        chatId,
        userId,
        isAdmin: false,
      }));

      await prisma.chatMember.createMany({
        data: newMembers,
        skipDuplicates: true,
      });
    }

    // 2. Remove members
    if (data.removeMembers?.length) {
      await prisma.chatMember.deleteMany({
        where: {
          chatId,
          userId: { in: data.removeMembers },
        },
      });
    }

    // 3. Update chat fields (AFTER member updates)
    const updatedChat = await prisma.chat.update({
      where: { id: chatId },
      data: {
        name: data.name,
        labels: data.labels,
        isVerified: data.isVerified,
        unreadCount: data.unreadCount,
        status: data.status,
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                phone: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      chat: updatedChat,
      message: 'Chat updated successfully',
    });
  } catch (error: any) {
    console.error('[PUT /api/chats/[id]]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update chat' },
      { status: 500 }
    );
  }
}