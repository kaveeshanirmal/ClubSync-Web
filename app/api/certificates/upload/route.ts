import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadCertificateToCloudinary } from '@/utils/uploadCertificateToCloudinary';
import { prisma } from '@/prisma/client';

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[Certificate Upload] Starting update process...');

    // Try to parse as JSON first (for URL update), fall back to FormData
    const contentType = req.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      // Simple URL update (certificate already uploaded to Cloudinary)
      const body = await req.json();
      const { certificateId, certificateUrl } = body;

      console.log('[Certificate Upload] Updating with URL:', { certificateId, certificateUrl });

      if (!certificateId || !certificateUrl) {
        return NextResponse.json(
          { error: 'Missing certificateId or certificateUrl' },
          { status: 400 }
        );
      }

      // Update certificate record with Cloudinary URL
      const certificate = await prisma.certificate.update({
        where: {
          certificateId,
        },
        data: {
          certificateUrl,
        },
      });

      console.log('[Certificate Upload] Database updated successfully');

      return NextResponse.json({
        success: true,
        certificateUrl,
        certificate,
      });
    } else {
      // Legacy: Server-side upload (FormData)
      const formData = await req.formData();
      const file = formData.get('file') as File;
      const certificateId = formData.get('certificateId') as string;
      const format = formData.get('format') as 'pdf' | 'png' | 'jpeg';

      console.log('[Certificate Upload] Server-side upload:', {
        hasFile: !!file,
        certificateId,
        format,
        fileSize: file?.size,
        fileType: file?.type,
      });

      if (!file || !certificateId || !format) {
        console.error('[Certificate Upload] Missing required fields');
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        );
      }

      // Convert file to buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      console.log('[Certificate Upload] Buffer created, size:', buffer.length);

      // Generate filename using certificate ID
      const fileName = `${certificateId}`;

      console.log('[Certificate Upload] Uploading to Cloudinary...');

      // Upload to Cloudinary
      const certificateUrl = await uploadCertificateToCloudinary(
        buffer,
        fileName,
        format
      );

      console.log('[Certificate Upload] Cloudinary URL:', certificateUrl);

      // Update certificate record with Cloudinary URL
      const certificate = await prisma.certificate.update({
        where: {
          certificateId,
        },
        data: {
          certificateUrl,
        },
      });

      console.log('[Certificate Upload] Database updated successfully');

      return NextResponse.json({
        success: true,
        certificateUrl,
        certificate,
      });
    }
  } catch (error) {
    console.error('[Certificate Upload] Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to upload certificate',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
