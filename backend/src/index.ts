import express from 'express';
import cors from 'cors';

import connectDB from './connectDB';
import userRouter from './routes/user';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000', // ✅ or '*' if you're using Postman
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(express.json());

// ✅ Correct use of router
app.use('/api/v1', userRouter);

connectDB()
  .then(() => {
    app.listen(3000, () => {
      console.log(`Server is running on port 3000`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed', err);
  });

export default app;
