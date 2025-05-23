import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { chatId, content } = await req.json();

  const message = await prisma.message.create({
    data: {
      chatId,
      senderId: user.id,
      content,
      status: 'sent',
      isOutgoing: true,
    },
  });

  await prisma.chat.update({
    where: { id: chatId },
    data: {
      lastMessage: content,
      lastMessageTime: new Date(),
    },
  });

  return NextResponse.json({ message });
}

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { chatId } = req.nextUrl.searchParams as any;

  const messages = await prisma.message.findMany({
    where: { chatId },
    orderBy: { timestamp: 'asc' },
  });

  return NextResponse.json(messages);
}