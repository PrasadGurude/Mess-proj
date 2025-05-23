import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { config } from 'dotenv';
import { prisma } from '../lib/prisma';
import { verifyJwt } from '../lib/jwt';
config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Singleton class to track online users and their sockets
class OnlineUsers {
  private static instance: OnlineUsers;
  private userSockets: Map<string, Set<string>> = new Map(); // userId -> Set<socketId>

  private constructor() {}

  static getInstance() {
    if (!OnlineUsers.instance) {
      OnlineUsers.instance = new OnlineUsers();
    }
    return OnlineUsers.instance;
  }

  add(userId: string, socketId: string) {
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    this.userSockets.get(userId)!.add(socketId);
  }

  remove(userId: string, socketId: string) {
    if (this.userSockets.has(userId)) {
      this.userSockets.get(userId)!.delete(socketId);
      if (this.userSockets.get(userId)!.size === 0) {
        this.userSockets.delete(userId);
      }
    }
  }

  isOnline(userId: string) {
    return this.userSockets.has(userId);
  }

  getOnlineUserIds() {
    return Array.from(this.userSockets.keys());
  }
}

const onlineUsers = OnlineUsers.getInstance();

// Middleware for authenticating socket connections using JWT
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('Authentication error: No token provided'));
  try {
    const user = verifyJwt(token);
    socket.data.user = user;
    next();
  } catch (err) {
    next(new Error('Authentication error: Invalid token'));
  }
});

io.on('connection', async (socket) => {
  const user = socket.data.user;
  onlineUsers.add(user.id, socket.id);
  console.log('User connected:', user.id, socket.id);

  // Join all chat rooms the user is a member of
  const chatMemberships = await prisma.chatMember.findMany({
    where: { userId: user.id },
    select: { chatId: true },
  });
  const chatIds = chatMemberships.map((m) => m.chatId);
  chatIds.forEach((chatId) => {
    socket.join(chatId);
  });

  // Notify other members in each chat that this user is online
  for (const chatId of chatIds) {
    socket.to(chatId).emit('user-online', { userId: user.id });
  }

  // Join a specific chat room
  socket.on('join-chat', (chatId) => {
    socket.join(chatId);
    console.log(`User ${user.id} joined chat ${chatId}`);
  });

  // Send message event
  socket.on('send-message', async (data) => {
    // data: { chatId, content }
    try {
      // Save message to DB
      const message = await prisma.message.create({
        data: {
          chatId: data.chatId,
          senderId: user.id,
          content: data.content,
          status: 'sent',
          isOutgoing: true,
        },
      });
      // Update chat last message
      await prisma.chat.update({
        where: { id: data.chatId },
        data: {
          lastMessage: data.content,
          lastMessageTime: new Date(),
        },
      });
      // Emit to all members in the chat room
      io.to(data.chatId).emit('new-message', {
        ...message,
        sender: { id: user.id, name: user.name },
      });
    } catch (err) {
      console.error('Error sending message:', err);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Leave chat room
  socket.on('leave-chat', (chatId) => {
    socket.leave(chatId);
    console.log(`User ${user.id} left chat ${chatId}`);
  });

  socket.on('disconnect', async () => {
    onlineUsers.remove(user.id, socket.id);
    // If user is now fully offline, notify all their chats
    if (!onlineUsers.isOnline(user.id)) {
      for (const chatId of chatIds) {
        socket.to(chatId).emit('user-offline', { userId: user.id });
      }
    }
    console.log('User disconnected:', user.id, socket.id);
  });
});

const PORT = process.env.SOCKET_PORT || 4001;
server.listen(PORT, () => console.log(`Socket.IO server running on port ${PORT}`));