"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiddlewares = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const userMiddlewares = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Explicitly define the return type as Promise<void>
    try {
        const header = req.headers.authorization;
        if (!header || !header.startsWith('Bearer ')) {
            res // Remove 'return' here
                .status(401)
                .json({ message: 'Authorization header missing or invalid' });
            return; // Still need to return to prevent further execution in this middleware
        }
        const token = header.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
        req.userId = decoded.id;
        next();
    }
    catch (error) {
        console.error('Authentication error:', error);
        res // Remove 'return' here
            .status(401)
            .json({ message: 'Unauthorized' });
        return; // Still need to return to prevent further execution
    }
});
exports.userMiddlewares = userMiddlewares;
