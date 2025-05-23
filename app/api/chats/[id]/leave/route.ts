import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth'; 

export async function DELETE(
  req: NextRequest,
  { params }: { params: { chatId: string } }
) {
  const authUser = getAuthUser(req);
  if (!authUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const chatId = params.chatId;

  try {
    // Get the user who is leaving
    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: { id: true, name: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Remove the user from the chat
    await prisma.chatMember.delete({
      where: {
        chatId_userId: {
          chatId,
          userId: user.id,
        },
      },
    });

    // Create a system message with user as sender
    await prisma.message.create({
      data: {
        chatId,
        senderId: user.id, 
        content: `${user.name} left the chat.`,
        isOutgoing: false,
        metadata: {
          system: true,
          type: 'user_left',
          userId: user.id,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'User left the chat and message sent.',
    });
  } catch (error: any) {
    console.error('[LEAVE CHAT]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to leave chat.' },
      { status: 500 }
    );
  }
}
