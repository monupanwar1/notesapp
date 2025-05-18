"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DATABASE_URI = exports.PORT = exports.JWT_SECRET = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)(); // Load .env file (if it exists)
const JWT_SECRET = process.env.JWT_SECRET || 'userSecret@1234';
exports.JWT_SECRET = JWT_SECRET;
const PORT = parseInt(process.env.PORT || '3000', 10);
exports.PORT = PORT;
const DATABASE_URI = process.env.DATABASE_URI || 'mongodb://localhost:27017/mydatabase';
exports.DATABASE_URI = DATABASE_URI;
