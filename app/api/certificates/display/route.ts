import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/client';
import jwt from 'jsonwebtoken';

/**
 * TEMPORARY WORKAROUND:
 * Current JWT tokens may not include userId field, only email.
 * This endpoint will:
 * 1. Check if userId is present in the token
 * 2. If not, lookup the user by email
 * 3. Use the found userId for certificate queries
 * 
 * TODO: After fixing the token generation process:
 * 1. Remove this workaround
 * 2. Invalidate all existing tokens OR
 * 3. Add a token version field and update validation middleware
 */

interface JWTPayload {
  userId?: string; // Made optional to handle legacy tokens without userId
  email: string;
  iat?: number;
  exp?: number;
}

/**
 * GET /api/certificates/display
 * Retrieves all certificates for the authenticated user
 * Authentication: Required (Bearer token)
 */
export async function GET(request: NextRequest) {
  try {
    // Extract the Authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Extract the token
    const token = authHeader.split(' ')[1];
    
    // Verify and decode the token
    let decoded: JWTPayload;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
      
      // Debug: Log JWT token contents to verify correct user info
      console.log('JWT token successfully verified');
      console.log('Token payload:', {
        userId: decoded.userId,
        email: decoded.email,
        issuedAt: decoded.iat ? new Date(decoded.iat * 1000).toISOString() : 'not set',
        expiresAt: decoded.exp ? new Date(decoded.exp * 1000).toISOString() : 'not set'
      });
    } catch (error) {
      console.error('JWT verification failed:', error);
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // WORKAROUND: Check if userId is missing from token
    let userId = decoded.userId;
    
    // If userId is missing but email is present, look up the user by email
    if (!userId && decoded.email) {
      console.log(`No userId found in token. Looking up user by email: ${decoded.email}`);
      try {
        const user = await prisma.user.findUnique({
          where: { email: decoded.email }
        });
        
        if (!user) {
          console.error(`No user found with email: ${decoded.email}`);
          return NextResponse.json(
            { error: 'User not found with the provided email' },
            { status: 404 }
          );
        }
        
        userId = user.id;
        console.log(`Found user ID from email: ${userId}`);
      } catch (lookupError) {
        console.error('Error looking up user by email:', lookupError);
        return NextResponse.json(
          { error: 'Failed to retrieve user information' },
          { status: 500 }
        );
      }
    }
    
    // Verify we have a userId to continue
    if (!userId) {
      console.error('Unable to determine user ID from token');
      return NextResponse.json(
        { error: 'Missing user identifier in authorization token' },
        { status: 401 }
      );
    }
    
    // Get only certificates that belong to the authenticated user
    console.log(`Fetching certificates for user ID: ${userId}`);

    // Debug: Create query object for logging
    const queryParams = {
      where: { userId: userId },
      orderBy: { issuedAt: 'desc' },
      include: { 
        event: { include: { club: true } }
      }
    };
    
    console.log('Query parameters:', JSON.stringify(queryParams, null, 2));

    // Using the prisma client with type assertion to avoid TypeScript errors
    // This pattern is used elsewhere in the project when model names aren't fully typed
    const certificatesResult = await (prisma as any).certificate.findMany({
      where: {
        userId: userId  // This filters to ONLY return certificates belonging to this specific user
      },
      orderBy: {
        issuedAt: 'desc'
      },
      include: {
        event: {
          include: {
            club: true
          }
        }
      }
    });

    console.log(`Found ${certificatesResult.length} certificates for user ${userId}`);
    
    // Debug: Log full certificate details to verify filtering
    console.log('Certificate details for debugging:');
    certificatesResult.forEach((cert: any, index: number) => {
      console.log(`Certificate ${index + 1}:`);
      console.log(` - ID: ${cert.id}`);
      console.log(` - User ID: ${cert.userId}`); // Verify this matches the authenticated user
      console.log(` - Certificate ID: ${cert.certificateId}`);
      console.log(` - Event Name: ${cert.eventName}`);
      console.log(` - Club Name: ${cert.clubName}`);
      console.log(` - Issued At: ${cert.issuedAt}`);
    });
    
    // Transform the user's certificates to match the mobile app's expectations
    const formattedCertificates = certificatesResult.map((cert: any) => ({
      id: cert.id,
      credentialId: cert.certificateId,
      title: cert.eventName,
      issuer: cert.clubName,
      dateEarned: cert.issuedAt.toISOString(),
      description: `Participation certificate for ${cert.eventName}`,
      status: 'Issued',
      // Extract skills from event category if available
      skills: cert.event?.category ? [cert.event.category] : [],
    }));

    // Debug: Log the formatted certificates that will be sent to client
    console.log('Formatted certificates for mobile app:', JSON.stringify(formattedCertificates, null, 2));
    console.log(`Returning ${formattedCertificates.length} certificates to the client for user ${userId}`);

    return NextResponse.json({
      success: true,
      certificates: formattedCertificates,
      count: formattedCertificates.length
    });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return NextResponse.json(
      {
        error: 'Failed to retrieve certificates',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * HEAD /api/certificates/display
 * Simple endpoint to verify token validity
 * Authentication: Required (Bearer token)
 */
export async function HEAD(request: NextRequest) {
  try {
    // Extract the Authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new NextResponse(null, { status: 401 });
    }

    // Extract the token
    const token = authHeader.split(' ')[1];
    
    // Verify and decode the token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
      
      // For consistency with GET, check if either userId or email exists
      if (!decoded.userId && !decoded.email) {
        console.error('Token is valid but missing both userId and email');
        return new NextResponse(null, { status: 401 });
      }
      
      return new NextResponse(null, { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      return new NextResponse(null, { status: 401 });
    }
  } catch (error) {
    console.error('Error validating token:', error);
    return new NextResponse(null, { status: 500 });
  }
}
