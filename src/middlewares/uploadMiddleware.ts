import multer from 'multer';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { Request } from 'express';
import { logger } from '../utils/logger';

// ⚠️ IMPORTANTE: Inicializar el cliente con el formato correcto
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Debug de las credenciales (formato seguro)
logger.info(`Supabase URL: ${supabaseUrl ? '✅ Configured' : '❌ Missing'}`);
logger.info(`Supabase Key: ${supabaseKey ? '✅ Configured (length: ' + (supabaseKey ? supabaseKey.length : 0) + ')' : '❌ Missing'}`);

// Ensure environment variables are defined
if (!supabaseUrl) {
  throw new Error('SUPABASE_URL environment variable is not defined');
}
if (!supabaseKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is not defined');
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Only allow images
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed') as any, false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    fieldSize: 2 * 1024 * 1024  // 2MB for text fields
  }
});

export async function uploadImageToSupabase(
  file: Express.Multer.File,
  folder: string = 'productos'
): Promise<string> {
  try {
    // Generate unique filename
    const timestamp = Date.now();
    const extension = path.extname(file.originalname);
    const fileName = `${folder}/${timestamp}-${Math.random().toString(36).substring(7)}${extension}`;
    
    logger.info(`🔄 Uploading to Supabase: ${fileName}`);
    logger.info(`📁 File size: ${file.size} bytes`);
    logger.info(`🏷️ MIME type: ${file.mimetype}`);

    // Verificar si tenemos acceso al bucket primero
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      logger.error(`❌ Cannot access Supabase storage: ${bucketsError.message}`);
      throw new Error(`Storage access error: ${bucketsError.message}`);
    }

    logger.info(`✅ Connected to Supabase Storage. Available buckets: ${buckets.map(b => b.name).join(', ')}`);
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('tigreimg')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (error) {
      logger.error(`❌ Upload error: ${error.message}`);
      throw new Error(`Error uploading to Supabase: ${error.message}`);
    }

    if (!data || !data.path) {
      logger.error('❌ Upload completed but no path returned');
      throw new Error('Upload response missing path');
    }

    // Build public URL
    const publicURL = `${supabaseUrl}/storage/v1/object/public/tigreimg/${data.path}`;
    logger.info(`✅ Upload successful! Public URL: ${publicURL}`);
    
    return publicURL;
  } catch (error) {
    logger.error('❌ Supabase upload error:', error as Error);
    throw error;
  }
}

export const uploadSingle = upload.single('image');
