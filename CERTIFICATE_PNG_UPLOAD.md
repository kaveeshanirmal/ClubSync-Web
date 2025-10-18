# Certificate PNG Upload to Cloudinary - Setup Complete! 🎉

## What Changed

✅ **PNG Format**: Certificates now generate as PNG (not PDF) and upload to Cloudinary
✅ **Client-Side Upload**: Uses Cloudinary's unsigned upload (no server-side needed)
✅ **Simplified Flow**: Generate PNG → Upload to Cloudinary → Update database
✅ **Test Page**: Added "Upload to Cloudinary" button to certificate preview

## How to Test

### 1. Visit Certificate Preview Page
```
http://localhost:3001/certificate-preview
```

### 2. Click "📤 Upload PNG to Cloudinary"
- Must be logged in first
- Certificate will be generated as PNG
- Automatically uploaded to Cloudinary
- URL will be displayed

### 3. Check Your Cloudinary Dashboard
Visit: https://console.cloudinary.com/
Navigate to: Media Library → certificates folder
You should see your uploaded certificate!

## Certificate Format

- **Format**: PNG (not PDF)
- **Size**: 1200x850px at 2x scale (high quality)
- **Storage**: Cloudinary `/certificates` folder
- **Naming**: Uses certificate ID (e.g., `CERT-1234567890-ABC123.png`)

## Using in Your App

### To Issue a Certificate:

```typescript
import { generateAndSaveCertificate } from '@/utils/saveCertificate';
import { useRef } from 'react';

// 1. Create ref for certificate element
const certificateRef = useRef<HTMLDivElement>(null);

// 2. Render certificate (hidden)
<div style={{ position: 'absolute', left: '-9999px' }}>
  <Certificate
    ref={certificateRef}
    userName={user.firstName + ' ' + user.lastName}
    eventName={event.title}
    clubName={event.club.name}
    eventDate={event.startDateTime.toISOString()}
    certificateId="" // Auto-generated
  />
</div>

// 3. Generate and upload
const handleIssueCertificate = async () => {
  if (!certificateRef.current) return;
  
  const result = await generateAndSaveCertificate(
    certificateRef.current,
    userId,
    eventId
  );

  if (result.success) {
    console.log('Certificate URL:', result.certificateUrl);
    // Send email notification with result.certificateUrl
  } else {
    console.error('Error:', result.error);
  }
};
```

## Environment Variables

Your `.env` file now has:
```env
# Server-side (secure)
CLOUDINARY_CLOUD_NAME=dndtt6j1z
CLOUDINARY_API_KEY=339238254621743
CLOUDINARY_API_SECRET=3itr2IyPQEOycLi54itpZsoWRxc

# Client-side (public)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dndtt6j1z
```

## Cloudinary Settings

Make sure you have an **unsigned upload preset** named `unsigned_clubsync`:

1. Go to: https://console.cloudinary.com/settings/upload
2. Scroll to "Upload presets"
3. Find or create preset: `unsigned_clubsync`
4. Set "Signing Mode" to **Unsigned**
5. Set "Folder" to `certificates` (optional)

## Certificate Wallet

Users can view all their certificates at:
```
http://localhost:3001/certificate-wallet
```

Shows:
- All certificates for logged-in user
- Certificate preview cards
- View/Download buttons
- Direct links to Cloudinary

## Benefits of PNG Upload

✅ **Faster**: PNG is smaller than PDF
✅ **Universal**: Works everywhere (email, web, mobile)
✅ **Preview**: Can be displayed inline
✅ **Quality**: High resolution (2x scale)
✅ **Client-Side**: No server processing needed

## What's Next

1. ✅ Test PNG upload at `/certificate-preview`
2. Add email notifications to send certificates to users
3. Add bulk certificate generation for event organizers
4. Add certificate verification page (public)

## Troubleshooting

### "Please log in first"
- You need to be logged in to upload certificates
- Go to `/login` and sign in

### Upload fails
- Check console for errors
- Verify unsigned preset exists: `unsigned_clubsync`
- Check Cloudinary cloud name: `dndtt6j1z`

### Certificate not in database
- Check terminal logs for database errors
- Run `npx prisma generate` if you see Prisma errors
- Make sure you're using the correct userId and eventId

## Summary

🎉 **PNG certificate upload to Cloudinary is now working!**

Simply click "📤 Upload PNG to Cloudinary" on the preview page to test it out.

The certificate will be:
1. Generated as high-quality PNG
2. Uploaded to Cloudinary
3. URL displayed on success
4. Ready to email to users!

