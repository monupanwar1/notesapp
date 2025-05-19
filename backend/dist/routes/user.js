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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_1 = require("express"); // Import NextFunction
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const config_1 = require("../config");
const userAuth_1 = require("../middlewares/userAuth");
const db_1 = require("../models/db");
const utils_1 = require("../utils");
const userRouter = (0, express_1.Router)();
// Zod Schemas
const authSchema = zod_1.z.object({
    username: zod_1.z.string().min(3).max(15),
    password: zod_1.z.string().min(6),
});
// Signup Route
userRouter.post('/signup', (req, res, next) => {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        const result = authSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                message: 'Invalid input',
                errors: result.error.format(),
            });
        }
        const { username, password } = result.data;
        try {
            const existingUser = yield db_1.UserModel.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            yield db_1.UserModel.create({ username, password: hashedPassword });
            res.status(201).json({ message: 'User created successfully' });
        }
        catch (error) {
            next(error); // Pass the error to the next error-handling middleware
        }
    }))().catch(next); // Catch any errors outside the try/catch in the async function
}),
    // Signin Route
    userRouter.post('/signin', (req, res, next) => {
        (() => __awaiter(void 0, void 0, void 0, function* () {
            const result = authSchema.safeParse(req.body);
            if (!result.success) {
                return res.status(400).json({
                    message: 'Invalid input',
                    errors: result.error.format(),
                });
            }
            const { username, password } = result.data;
            try {
                const user = yield db_1.UserModel.findOne({ username });
                if (!user) {
                    return res.status(400).json({ message: 'User not found' });
                }
                if (typeof user.password !== 'string') {
                    console.error('Error: User password in database is not a string');
                    return res.status(500).json({ message: 'Internal server error' });
                }
                const isMatch = yield bcryptjs_1.default.compare(password, user.password);
                if (!isMatch) {
                    return res.status(400).json({ message: 'Invalid password' });
                }
                const token = jsonwebtoken_1.default.sign({ id: user._id }, config_1.JWT_SECRET, {
                    expiresIn: '1d',
                });
                res.status(200).json({
                    message: 'Login successful',
                    token,
                });
            }
            catch (error) {
                next(error); // Pass the error to the next error-handling middleware
            }
        }))().catch(next); // Catch any errors outside the try/catch
    });
// add content
userRouter.post('/addContent', userAuth_1.userMiddlewares, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { link, type, title } = req.body;
    yield db_1.contentModel.create({
        link,
        type,
        title,
        userId: req.userId,
        tags: [],
    });
    res.status(200).json({
        message: 'content added',
    });
}));
userRouter.get('/getContent', userAuth_1.userMiddlewares, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const content = yield db_1.contentModel.find({ userId });
    res.status(200).json({
        message: 'content',
        content,
    });
}));
// In your userRouter file
userRouter.delete('/getContent', userAuth_1.userMiddlewares, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const contentId = (_a = req.body) === null || _a === void 0 ? void 0 : _a.contentId;
    yield db_1.contentModel.deleteMany({
        contentId,
        userId: req.userId,
    });
    res.json({ message: 'Deleted' });
}));
// Share brain (create/get link)
userRouter.post('/brain/share', userAuth_1.userMiddlewares, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { share } = req.body;
    try {
        const existingLink = yield db_1.LinkModel.findOne({ userId: req.userId });
        if (share) {
            if (existingLink) {
                res.json({ hash: existingLink.hash });
                return;
            }
            const hash = (0, utils_1.random)(10);
            yield db_1.LinkModel.create({ userId: req.userId, hash });
            res.json({ hash });
            return;
        }
        else {
            const result = yield db_1.LinkModel.deleteOne({ userId: req.userId });
            res.json({
                message: 'Removed link',
                deletedCount: result.deletedCount,
            });
            return;
        }
    }
    catch (error) {
        next(error);
    }
}));
// Get shared brain content
userRouter.get('/brain/:shareLink', (req, res, next) => {
    const { shareLink: hash } = req.params;
    db_1.LinkModel.findOne({ hash })
        .then((link) => {
        if (!link) {
            res.status(404).json({ message: 'Invalid share link' });
            return Promise.reject(); // Stop further execution
        }
        return Promise.all([
            db_1.contentModel.find({ userId: link.userId }),
            db_1.UserModel.findOne({ _id: link.userId }),
            link,
        ]);
    })
        .then(([content, user, link]) => {
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json({ username: user.username, content });
    })
        .catch((error) => {
        if (error)
            next(error);
    });
});
exports.default = userRouter;
