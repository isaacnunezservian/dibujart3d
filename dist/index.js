"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const products_1 = __importDefault(require("./routes/products"));
const categories_1 = __importDefault(require("./routes/categories")); // ✅ CORRECCIÓN: Importar el router correcto
const errorMiddleware_1 = require("./middlewares/errorMiddleware");
const logger_1 = require("./utils/logger");
// import { createClient } from '@supabase/supabase-js';
dotenv_1.default.config();
// console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('DATABASE_URL:', process.env.DATABASE_URL);
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Initialize Prisma Client
exports.prisma = new client_1.PrismaClient();
// Middleware
app.use((0, cors_1.default)({
    origin: '*',
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Request logging
app.use((req, res, next) => {
    logger_1.logger.info(`${req.method} ${req.path} - ${req.ip}`);
    next();
});
// Routes
app.use('/api/products', products_1.default);
app.use('/api/categories', categories_1.default); // ✅ CORRECCIÓN: Ahora usa el router correcto
// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
// Error handling middleware
app.use(errorMiddleware_1.errorHandler);
// Handle 404
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
// Graceful shutdown
process.on('SIGINT', async () => {
    logger_1.logger.info('Shutting down gracefully...');
    await exports.prisma.$disconnect();
    process.exit(0);
});
// Start server
app.listen(PORT, () => {
    logger_1.logger.info(`Server running on port ${PORT}`);
    logger_1.logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map