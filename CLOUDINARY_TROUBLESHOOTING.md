# Cloudinary Upload Troubleshooting Guide

## 🔍 Diagnosis Steps

### Step 1: Test Cloudinary Configuration
Visit: http://localhost:3001/api/test-cloudinary

This will test if your Cloudinary credentials are configured correctly.

**Expected Response:**
```json
{
  "status": "success",
  "message": "Cloudinary is configured correctly",
  "config": {
    "cloud_name": "dndtt6j1z",
    "api_key": "***1743",
    "api_secret": "***configured"
  }
}
```

### Step 2: Check Environment Variables

Verify your `.env` file has:
```env
CLOUDINARY_CLOUD_NAME=dndtt6j1z
CLOUDINARY_API_KEY=339238254621743
CLOUDINARY_API_SECRET=3itr2IyPQEOycLi54itpZsoWRxc
```

### Step 3: Check Console Logs

When you try to upload a certificate, check the terminal for logs:

**Look for these logs:**
```
[Certificate Upload] Starting upload process...
[Certificate Upload] Received: { hasFile: true, certificateId: '...', ... }
[Certificate Upload] Buffer created, size: ...
[Certificate Upload] Uploading to Cloudinary...
[Cloudinary] Starting upload: { fileName: '...', format: 'pdf', ... }
[Cloudinary] Resource type: raw
[Cloudinary] Upload successful: https://res.cloudinary.com/...
```

**If you see errors, note them down!**

### Step 4: Test Certificate Generation

1. Go to `/certificate-preview`
2. Open browser console (F12)
3. Try to download a certificate
4. Check console for any errors

## 🐛 Common Issues & Solutions

### Issue 1: "Unauthorized" Error
**Problem:** Not logged in or session expired
**Solution:** 
- Make sure you're logged in
- Try refreshing the page
- Clear cookies and log in again

### Issue 2: "Failed to upload certificate"
**Problem:** Cloudinary credentials are incorrect
**Solution:**
- Double-check credentials at https://console.cloudinary.com/
- Make sure there are no extra spaces in `.env` file
- Restart dev server after changing `.env`

### Issue 3: Upload succeeds but URL is not saved
**Problem:** Database update fails
**Solution:**
- Check if Prisma client is generated: `npx prisma generate`
- Check database connection
- Look for database errors in terminal

### Issue 4: Certificate generation fails
**Problem:** DOM element not found or rendering issue
**Solution:**
- Make sure certificate element is rendered before calling save
- Check browser console for html2canvas errors
- Try using PNG format instead of PDF

### Issue 5: "Property 'certificate' does not exist"
**Problem:** Prisma client not regenerated
**Solution:**
```bash
npx prisma generate
```
Then restart dev server

## 🧪 Manual Test Flow

### Test 1: Direct API Test (using Postman or curl)

You can't easily test the upload endpoint directly because it requires:
1. Authentication session
2. Valid certificate record in database
3. File upload

### Test 2: Using Certificate Preview Page

1. Visit http://localhost:3001/certificate-preview
2. Open Developer Tools (F12) → Console tab
3. Click "Download PDF"
4. Check if certificate downloads successfully

### Test 3: Using Save Function

Add this test button to certificate-preview page:

```typescript
const handleTestSave = async () => {
  if (!certificateRef.current) return;
  
  const result = await generateAndSaveCertificate(
    certificateRef.current,
    'user-id-here',  // Replace with actual user ID
    'event-id-here', // Replace with actual event ID
    'pdf'
  );
  
  console.log('Save result:', result);
  
  if (result.success) {
    alert('Certificate saved! URL: ' + result.certificateUrl);
  } else {
    alert('Error: ' + result.error);
  }
};
```

## 📊 Debugging Checklist

- [ ] Dev server is running
- [ ] Cloudinary credentials are in `.env`
- [ ] `.env` file is in the root directory
- [ ] Restarted dev server after adding credentials
- [ ] Prisma client is generated (`npx prisma generate`)
- [ ] Logged in to the application
- [ ] Browser console is open to see errors
- [ ] Terminal/console is visible to see server logs

## 🔧 Quick Fixes

### Fix 1: Restart Everything
```bash
# Stop dev server (Ctrl+C)
npx prisma generate
npm run dev
```

### Fix 2: Clear Next.js Cache
```bash
# Stop dev server (Ctrl+C)
rm -rf .next
npm run dev
```

### Fix 3: Verify Cloudinary Account
1. Go to https://console.cloudinary.com/
2. Check if you're logged into the correct account
3. Verify the cloud name matches: `dndtt6j1z`
4. Try uploading a file manually through the web interface

## 📝 What to Report

If you're still having issues, provide:

1. **Error message from browser console**
2. **Error logs from terminal**
3. **Response from** `/api/test-cloudinary`
4. **What step fails?**
   - [ ] Certificate generation (client-side)
   - [ ] API call to create certificate record
   - [ ] Certificate upload to Cloudinary
   - [ ] Database update

## 🎯 Next Steps

1. Visit http://localhost:3001/api/test-cloudinary
2. Share the response you get
3. Try generating a certificate at `/certificate-preview`
4. Check terminal for logs with `[Cloudinary]` prefix
5. Let me know what errors you see!

