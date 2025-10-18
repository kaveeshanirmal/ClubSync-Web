import { generateCertificate } from './generateCertificate';

/**
 * Generate certificate PNG and upload directly to Cloudinary (client-side)
 * Then save the certificate record to database
 */
export async function generateAndSaveCertificate(
  certificateElement: HTMLElement,
  userId: string,
  eventId: string
): Promise<{
  success: boolean;
  certificateId?: string;
  certificateUrl?: string;
  error?: string;
}> {
  try {
    console.log('[Save Certificate] Starting process...');

    // Step 1: Create certificate record in database (gets certificateId)
    const createResponse = await fetch('/api/certificates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        eventId,
        certificateData: {
          certificateUrl: '', // Will be updated after upload
        },
      }),
    });

    if (!createResponse.ok) {
      const error = await createResponse.json();
      throw new Error(error.error || 'Failed to create certificate');
    }

    const { certificate } = await createResponse.json();
    const certificateId = certificate.certificateId;

    console.log('[Save Certificate] Certificate ID:', certificateId);

    // Step 2: Generate certificate PNG blob
    const blob = await generateCertificate({
      element: certificateElement,
      fileName: certificateId,
      format: 'png', // Always use PNG
    });

    console.log('[Save Certificate] PNG generated, size:', blob.size);

    // Step 3: Upload directly to Cloudinary (client-side unsigned upload)
    const formData = new FormData();
    formData.append('file', blob, `${certificateId}.png`);
    formData.append('upload_preset', 'unsigned_clubsync');
    formData.append('folder', 'certificates');

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dndtt6j1z';
    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!cloudinaryResponse.ok) {
      const errorData = await cloudinaryResponse.json();
      throw new Error(errorData.error?.message || 'Cloudinary upload failed');
    }

    const cloudinaryData = await cloudinaryResponse.json();
    const certificateUrl = cloudinaryData.secure_url;

    console.log('[Save Certificate] Uploaded to Cloudinary:', certificateUrl);

    // Step 4: Update certificate record with Cloudinary URL
    const updateResponse = await fetch('/api/certificates/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        certificateId,
        certificateUrl,
      }),
    });

    if (!updateResponse.ok) {
      console.warn('[Save Certificate] Failed to update database, but upload succeeded');
      // Don't throw - the upload succeeded, just log the warning
    }

    return {
      success: true,
      certificateId,
      certificateUrl,
    };
  } catch (error) {
    console.error('[Save Certificate] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
