"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const connectDB_1 = __importDefault(require("./connectDB"));
const user_1 = __importDefault(require("./routes/user"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000', // ✅ or '*' if you're using Postman
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
app.use(express_1.default.json());
// ✅ Correct use of router
app.use('/api/v1', user_1.default);
(0, connectDB_1.default)()
    .then(() => {
    app.listen(3000, () => {
        console.log(`Server is running on port 3000`);
    });
})
    .catch((err) => {
    console.error('Database connection failed', err);
});
exports.default = app;
