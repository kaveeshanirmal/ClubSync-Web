import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a certificate buffer to Cloudinary
 * @param buffer - The file buffer (PDF or image)
 * @param fileName - The name to use for the file
 * @param format - The file format ('pdf' | 'png' | 'jpeg')
 * @returns The secure URL of the uploaded file
 */
export async function uploadCertificateToCloudinary(
  buffer: Buffer,
  fileName: string,
  format: 'pdf' | 'png' | 'jpeg'
): Promise<string> {
  console.log('[Cloudinary] Starting upload:', { fileName, format, bufferSize: buffer.length });
  console.log('[Cloudinary] Config:', {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    has_api_key: !!process.env.CLOUDINARY_API_KEY,
    has_api_secret: !!process.env.CLOUDINARY_API_SECRET,
  });

  return new Promise((resolve, reject) => {
    const resourceType = format === 'pdf' ? 'raw' : 'image';
    
    console.log('[Cloudinary] Resource type:', resourceType);
    
    // Create upload stream
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'certificates', // Store all certificates in a dedicated folder
        public_id: fileName,
        resource_type: resourceType,
        format: format,
      },
      (error, result) => {
        if (error) {
          console.error('[Cloudinary] Upload error:', error);
          reject(error);
        } else {
          console.log('[Cloudinary] Upload successful:', result?.secure_url);
          resolve(result!.secure_url);
        }
      }
    );

    // Write buffer to upload stream
    uploadStream.end(buffer);
  });
}

/**
 * Delete a certificate from Cloudinary
 * @param publicId - The public ID of the file (extracted from URL)
 * @param format - The file format
 */
export async function deleteCertificateFromCloudinary(
  publicId: string,
  format: 'pdf' | 'png' | 'jpeg'
): Promise<void> {
  const resourceType = format === 'pdf' ? 'raw' : 'image';
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}
