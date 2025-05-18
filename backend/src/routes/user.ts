import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response, Router } from 'express'; // Import NextFunction
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { JWT_SECRET } from '../config';
import { contentModel, UserModel } from '../models/db';
import app from '..';
import { userMiddlewares } from '../middlewares/userAuth';

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
);

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
userRouter.post('/addContent',userMiddlewares,async(req:Request,res:Response)=>{
  const{link,type,title}=req.body;

  await contentModel.create({
    link,
    type,
    title,
    userId:req.userId,
    tags:[]
  });
  res.status(200).json({
    message:"content added"
  })
})

userRouter.get('/getContent',userMiddlewares, async (req: Request, res: Response) => {
  // @ts-ignore
  const userId =req.userId;
  const content = await contentModel.find({userId})
  res.status(200).json({
    message: 'content',
    content

  });
});

export default userRouter;
