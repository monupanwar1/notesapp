import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

// Extend the Request interface to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const userMiddlewares = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res // Remove 'return' here
      .status(401)
      .json({ message: 'Unauthorized' });
    return; // Still need to return to prevent further execution
  }
};
