import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

export async function GET() {
  try {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Test configuration
    const config = {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY ? '***' + process.env.CLOUDINARY_API_KEY.slice(-4) : 'missing',
      api_secret: process.env.CLOUDINARY_API_SECRET ? '***configured' : 'missing',
    };

    // Try a simple API call to verify credentials
    const result = await cloudinary.api.ping();

    return NextResponse.json({
      status: 'success',
      message: 'Cloudinary is configured correctly',
      config,
      ping: result,
    });
  } catch (error) {
    console.error('Cloudinary test error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        config: {
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY ? '***' + process.env.CLOUDINARY_API_KEY.slice(-4) : 'missing',
          api_secret: process.env.CLOUDINARY_API_SECRET ? '***configured' : 'missing',
        },
      },
      { status: 500 }
    );
  }
}
