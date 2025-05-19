import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response, Router } from 'express'; // Import NextFunction
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { JWT_SECRET } from '../config';
import { userMiddlewares } from '../middlewares/userAuth';
import { contentModel, LinkModel, UserModel } from '../models/db';
import { random } from '../utils';

const userRouter = Router();

// Zod Schemas
const authSchema = z.object({
  username: z.string().min(3).max(15),
  password: z.string().min(6),
});

// Signup Route
userRouter.post(
  '/signup',
  (req: Request, res: Response, next: NextFunction) => {
    (async () => {
      const result = authSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          message: 'Invalid input',
          errors: result.error.format(),
        });
      }

      const { username, password } = result.data;

      try {
        const existingUser = await UserModel.findOne({ username });
        if (existingUser) {
          return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await UserModel.create({ username, password: hashedPassword });

        res.status(201).json({ message: 'User created successfully' });
      } catch (error) {
        next(error); // Pass the error to the next error-handling middleware
      }
    })().catch(next); // Catch any errors outside the try/catch in the async function
  }
),
  // Signin Route
  userRouter.post(
    '/signin',
    (req: Request, res: Response, next: NextFunction) => {
      (async () => {
        const result = authSchema.safeParse(req.body);
        if (!result.success) {
          return res.status(400).json({
            message: 'Invalid input',
            errors: result.error.format(),
          });
        }

        const { username, password } = result.data;

        try {
          const user = await UserModel.findOne({ username });
          if (!user) {
            return res.status(400).json({ message: 'User not found' });
          }

          if (typeof user.password !== 'string') {
            console.error('Error: User password in database is not a string');
            return res.status(500).json({ message: 'Internal server error' });
          }

          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
          }

          const token = jwt.sign({ id: user._id }, JWT_SECRET, {
            expiresIn: '1d',
          });

          res.status(200).json({
            message: 'Login successful',
            token,
          });
        } catch (error) {
          next(error); // Pass the error to the next error-handling middleware
        }
      })().catch(next); // Catch any errors outside the try/catch
    }
  );

// add content
userRouter.post(
  '/addContent',
  userMiddlewares,
  async (req: Request, res: Response) => {
    const { link, type, title } = req.body;

    await contentModel.create({
      link,
      type,
      title,
      userId: req.userId,
      tags: [],
    });
    res.status(200).json({
      message: 'content added',
    });
  }
);

userRouter.get(
  '/getContent',
  userMiddlewares,
  async (req: Request, res: Response) => {
    const userId = req.userId;
    const content = await contentModel.find({ userId });
    res.status(200).json({
      message: 'content',
      content,
    });
  }
);

// In your userRouter file
userRouter.delete('/getContent', async (req: Request, res: Response) => {
  res.json({
    message: 'hello',
  });
});
// Share brain (create/get link)
userRouter.post(
  '/brain/share',
  userMiddlewares,
  async (req: Request, res: Response, next: NextFunction) => {
    const { share } = req.body;

    try {
      const existingLink = await LinkModel.findOne({ userId: req.userId });

      if (share) {
        if (existingLink) {
          res.json({ hash: existingLink.hash });
          return;
        }
        const hash = random(10);
        await LinkModel.create({ userId: req.userId, hash });
        res.json({ hash });
        return;
      } else {
        const result = await LinkModel.deleteOne({ userId: req.userId });
        res.json({
          message: 'Removed link',
          deletedCount: result.deletedCount,
        });
        return;
      }
    } catch (error) {
      next(error);
    }
  }
);
// Get shared brain content
userRouter.get(
  '/brain/:shareLink',
  (req: Request, res: Response, next: NextFunction) => {
    const { shareLink: hash } = req.params;

    LinkModel.findOne({ hash })
      .then((link) => {
        if (!link) {
          res.status(404).json({ message: 'Invalid share link' });
          return Promise.reject(); // Stop further execution
        }
        return Promise.all([
          contentModel.find({ userId: link.userId }),
          UserModel.findOne({ _id: link.userId }),
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
        if (error) next(error);
      });
  }
);
// Add these test routes at the TOP of your router file
userRouter.get('/test', (req, res) => {
  res.json({ message: 'Simple GET works!' });
});

userRouter.delete('/test', (req, res) => {
  res.json({ message: 'DELETE method works!' });
});
export default userRouter;
