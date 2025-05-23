"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStore = void 0;
class UserStore {
    constructor() {
        this.onlineUsers = new Map();
    }
    static getInstance() {
        if (!UserStore.instance) {
            UserStore.instance = new UserStore();
        }
        return UserStore.instance;
    }
    addUser(userId, socketId) {
        if (!this.onlineUsers.has(userId)) {
            this.onlineUsers.set(userId, new Set());
        }
        this.onlineUsers.get(userId).add(socketId);
    }
    removeUser(userId, socketId) {
        const sockets = this.onlineUsers.get(userId);
        if (!sockets)
            return false;
        sockets.delete(socketId);
        if (sockets.size === 0) {
            this.onlineUsers.delete(userId);
            return true; // fully offline
        }
        return false;
    }
    isUserOnline(userId) {
        return this.onlineUsers.has(userId);
    }
    getAllOnlineUsers() {
        return Array.from(this.onlineUsers.keys());
    }
    getSockets(userId) {
        return Array.from(this.onlineUsers.get(userId) ?? []);
    }
    clear() {
        this.onlineUsers.clear();
    }
}
exports.UserStore = UserStore;
