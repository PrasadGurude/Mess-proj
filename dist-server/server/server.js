"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const dotenv_1 = require("dotenv");
const prisma_1 = require("../lib/prisma");
const jwt_1 = require("../lib/jwt");
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, { cors: { origin: '*' } });
// Singleton class to track online users and their sockets
class OnlineUsers {
    constructor() {
        this.userSockets = new Map(); // userId -> Set<socketId>
    }
    static getInstance() {
        if (!OnlineUsers.instance) {
            OnlineUsers.instance = new OnlineUsers();
        }
        return OnlineUsers.instance;
    }
    add(userId, socketId) {
        if (!this.userSockets.has(userId)) {
            this.userSockets.set(userId, new Set());
        }
        this.userSockets.get(userId).add(socketId);
    }
    remove(userId, socketId) {
        if (this.userSockets.has(userId)) {
            this.userSockets.get(userId).delete(socketId);
            if (this.userSockets.get(userId).size === 0) {
                this.userSockets.delete(userId);
            }
        }
    }
    isOnline(userId) {
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
    if (!token)
        return next(new Error('Authentication error: No token provided'));
    try {
        const user = (0, jwt_1.verifyJwt)(token);
        socket.data.user = user;
        next();
    }
    catch (err) {
        next(new Error('Authentication error: Invalid token'));
    }
});
io.on('connection', async (socket) => {
    const user = socket.data.user;
    onlineUsers.add(user.id, socket.id);
    console.log('User connected:', user.id, socket.id);
    // Join all chat rooms the user is a member of
    const chatMemberships = await prisma_1.prisma.chatMember.findMany({
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
            const message = await prisma_1.prisma.message.create({
                data: {
                    chatId: data.chatId,
                    senderId: user.id,
                    content: data.content,
                    status: 'sent',
                    isOutgoing: true,
                },
            });
            // Update chat last message
            await prisma_1.prisma.chat.update({
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
        }
        catch (err) {
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
