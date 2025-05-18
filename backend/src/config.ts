import { config } from 'dotenv';
config(); // Load .env file (if it exists)

const JWT_SECRET: string = process.env.JWT_SECRET || 'userSecret@1234';
const PORT: number = parseInt(process.env.PORT || '3000', 10);
const DATABASE_URI: string =
  process.env.DATABASE_URI || 'mongodb://localhost:27017/mydatabase';

export { JWT_SECRET, PORT, DATABASE_URI };
