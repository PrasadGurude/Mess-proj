import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const chatId = params.id;

    const messages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { timestamp: 'asc' }, // optional: oldest to newest
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            color: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, messages });
  } catch (error: any) {
    console.error('[GET /api/chats/[id]/messages]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
  const user = getAuthUser(req);
    const chatId = params.id;
    const { content, senderId } = await req.json();

    const message = await prisma.message.create({
      data: {
        chatId,
        content,
        senderId:user!.id,
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

    return NextResponse.json({ success: true, message });
  } catch (error: any) {
    console.error('[POST /api/chats/[id]/messages]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to send message' },
      { status: 500 }
    );
  }
}
