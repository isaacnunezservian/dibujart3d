// ⏸️ TEMPORALMENTE COMENTADO - Volveremos a usar cuando agreguemos imágenes
/*
import multer from 'multer';

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Check if file is an image
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

// Multer configuration
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Single file upload middleware
export const uploadSingle = upload.single('image');
*/

import { Request } from 'express';


// ✅ TEMPORAL: Middleware dummy para no romper las importaciones
export const uploadSingle = (req: any, res: any, next: any) => {
  next(); // Solo pasa al siguiente middleware, no hace nada
};
