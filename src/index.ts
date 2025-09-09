import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import productRoutes from './routes/products';
import categoryRoutes from './routes/categories'; // ✅ CORRECCIÓN: Importar el router correcto
import { errorHandler } from './middlewares/errorMiddleware';
import { logger } from './utils/logger';
// import { createClient } from '@supabase/supabase-js';

dotenv.config();

// console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('=== ENVIRONMENT DEBUG ===');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'FOUND' : 'NOT FOUND');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// Initialize Prisma Client
export const prisma = new PrismaClient();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',                    // Frontend local
    'http://127.0.0.1:5173',                   // Localhost alternativo
    /^http:\/\/192\.168\.\d+\.\d+:5173$/,      // Red local con puerto 5173
    /^http:\/\/192\.168\.\d+\.\d+$/           // Red local sin puerto
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes); // ✅ CORRECCIÓN: Ahora usa el router correcto

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(errorHandler);

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
app.listen(PORT, HOST, () => {
  logger.info(`🚀 Server running on http://${HOST}:${PORT}`);
  logger.info(`📊 API available at http://${HOST}:${PORT}/api`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Para debugging - mostrar IP local
  const os = require('os');
  const networkInterfaces = os.networkInterfaces();
  const wifiInterface = networkInterfaces['Wi-Fi'] || networkInterfaces['Ethernet'];
  if (wifiInterface) {
    const ipv4 = wifiInterface.find((iface: any) => iface.family === 'IPv4');
    if (ipv4) {
      console.log(`🌍 Network access: http://${ipv4.address}:${PORT}/api`);
    }
  }
});

export default app;
