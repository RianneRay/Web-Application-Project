import express from 'express';
import cors from 'cors';

import { env_vars } from './config/envVars';
import { connectDB } from './config/db';

import urlRoute from './routes/urlRoute';

const app = express();
const PORT = env_vars.PORT || 5000;

app.get('/', (_req, res) => {
  res.send('API is running');
});

app.use(express.json());
app.use(cors());

app.use('/api', urlRoute);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server started on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();