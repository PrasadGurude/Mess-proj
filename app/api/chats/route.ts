import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const createChatSchema = z.object({
  name: z.string(),
  type: z.enum(['group', 'direct']),
  memberIds: z.array(z.string()),
  phone: z.string().optional(),
  labels: z.array(z.string()).optional(),
  adminIds: z.array(z.string()).optional(),
  createdBy: z.string().optional()
});

export async function GET(req: NextRequest) {
  try {
    const user =  getAuthUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const chats = await prisma.chat.findMany({
      where: { members: { some: { userId: user.id } } },
      include: {
        messages: {
          take: 1,
          orderBy: { timestamp: 'desc' },
        },
        members: {
          include: { user: true },
        },
      },
    });

    return NextResponse.json({ success: true, chats });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch chats' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user =  getAuthUser(req);
    const body = await req.json();
    const data = createChatSchema.parse(body);

    if (!user && !data.createdBy) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const creatorId = user?.id ?? data.createdBy!;
    const creator = await prisma.user.findUnique({ where: { id: creatorId } });

    const chat = await prisma.chat.create({
      data: {
        name: data.name,
        type: data.type,
        labels: data.labels ?? [],
        phone: data.phone,
      },
    });

    const members = data.memberIds.map((userId) => ({
      chatId: chat.id,
      userId,
      isAdmin: data.adminIds?.includes(userId) ?? false,
    }));

    await prisma.chatMember.createMany({ data: members });

    const message = await prisma.message.create({
      data: {
        chatId: chat.id,
        senderId: creatorId,
        content: `${creator?.name || 'Someone'} created this chat`,
        status: 'sent',
        timestamp: new Date(),
        isOutgoing: true,
      },
    });

    const newChat = await prisma.chat.update({
      where: { id: chat.id },
      data: {
        lastMessage: message.content,
        phone: data.phone || creator?.phone,
        lastMessageTime: message.timestamp,
      },
    });

    return NextResponse.json({ success: true, chat: newChat });
  } catch (error: any) {
    console.error('[CREATE CHAT FAILED]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
