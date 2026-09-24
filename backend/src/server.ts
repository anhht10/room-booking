import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './app';
import { db } from './database/db';

const PORT = Number(process.env.PORT) || 5000;
const HOST = '0.0.0.0';

async function bootstrap() {
  try {
    // 1. Initialize persistent storage
    await db.init();

    // 2. Start Express Server
    const app = createApp();
    app.listen(PORT, HOST, () => {
      console.log(`=================================================`);
      console.log(`🚀 Campus Booking Real Backend is running!`);
      console.log(`📡 Local:   http://localhost:${PORT}`);
      console.log(`🌐 Network: http://192.168.1.4:${PORT}`);
      console.log(`🩺 Health:  http://localhost:${PORT}/health`);
      console.log(`=================================================`);
    });
  } catch (err) {
    console.error('Fatal bootstrap error:', err);
    process.exit(1);
  }
}

bootstrap();

