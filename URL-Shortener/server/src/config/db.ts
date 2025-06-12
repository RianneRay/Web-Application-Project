import mongoose from 'mongoose';
import { env_vars } from './envVars';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(env_vars.MONGO_URI);
    console.log('MongoDB connected', mongoose.connection.name);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};