import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { UserModel } from '../db';
import { JWT_SECRET } from '../config';

const authRouter = Router();

// Zod Schemas
const authSchema = z.object({
  username: z.string().min(3).max(15),
  password: z.string().min(6),
});


// Signup Route
authRouter.post('/signup', async (req, res) => {
  const result = authSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: 'Invalid input',
      errors: result.error.format(),
    });
  }

  const { username, password } = result.data;

  const existingUser = await UserModel.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await UserModel.create({ username, password: hashedPassword });

  res.status(201).json({ message: 'User created successfully' });
});

// Signin Route
authRouter.post('/signin', async (req, res) => {
  const result = authSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: 'Invalid input',
      errors: result.error.format(),
    });
  }

  const { username, password } = result.data;

  const user = await UserModel.findOne({ username });
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid password' });
  }

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });

  res.status(200).json({
    message: 'Login successful',
    token,
  });
});

export default authRouter;
