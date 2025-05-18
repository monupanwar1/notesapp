import mongoose from 'mongoose';
import { config } from 'dotenv';

config(); // Load .env file

const connectDB = async () => {
  try {
    const dbUri = process.env.DATABASE_URI;
    if (!dbUri) {
      throw new Error('DATABASE_URI must be defined in .env file');
    }

    await mongoose.connect(dbUri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit process on connection failure
  }
};

export default connectDB;
