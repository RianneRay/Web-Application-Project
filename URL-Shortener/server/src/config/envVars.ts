import dotenv from 'dotenv'

dotenv.config();

export const env_vars = {
  MONGO_URI: process.env.MONGO_URI || '',
  PORT: process.env.PORT || 5000,
  BASE_URL: process.env.BASE_URL,
}