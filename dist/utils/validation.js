"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryParamsSchema = exports.productParamsSchema = exports.updateProductSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
// Product validation schemas
exports.createProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').max(255, 'Name too long'),
    colors: zod_1.z.array(zod_1.z.string()).min(1, 'At least one color is required'),
    categoryId: zod_1.z.number().int().positive('Category ID must be a positive integer')
});
exports.updateProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').max(255, 'Name too long').optional(),
    colors: zod_1.z.array(zod_1.z.string()).min(1, 'At least one color is required').optional(),
    categoryId: zod_1.z.number().int().positive('Category ID must be a positive integer').optional()
});
exports.productParamsSchema = zod_1.z.object({
    id: zod_1.z.string().regex(/^\d+$/, 'Invalid product ID').transform(Number),
});
// Para el endpoint getProductsByCategory
exports.categoryParamsSchema = zod_1.z.object({
    categoryId: zod_1.z.string().regex(/^\d+$/, 'Invalid category ID').transform(Number),
});
//# sourceMappingURL=validation.js.map