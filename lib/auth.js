"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthUser = getAuthUser;
exports.verifyToken = verifyToken;
const jwt_1 = require("./jwt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function getAuthUser(req) {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    if (!token)
        return null;
    try {
        return (0, jwt_1.verifyJwt)(token);
    }
    catch {
        return null;
    }
}
const SECRET = process.env.JWT_SECRET;
function verifyToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, SECRET);
    }
    catch {
        return null;
    }
}
