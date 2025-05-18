import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

export const userMiddlewares = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    // Attach userId to request
    // @ts-ignore
    req.userId = decoded.id;

    next();
  } catch (err) {
    console.error('JWT Verification Error:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
