# How to Create Unsigned Upload Preset in Cloudinary

## 🚨 Quick Fix for "Upload preset not found"

Your code is trying to use an upload preset called `unsigned_clubsync` that doesn't exist yet.

### Step 1: Go to Cloudinary Upload Settings

1. Open: https://console.cloudinary.com/settings/upload
2. Log in with your account (cloud: `dndtt6j1z`)

### Step 2: Create Upload Preset

1. Scroll down to the **"Upload presets"** section
2. Click **"Add upload preset"** button

### Step 3: Configure the Preset

Fill in these settings:

- **Preset name**: `unsigned_clubsync`
- **Signing mode**: Select **"Unsigned"** (IMPORTANT!)
- **Folder**: `certificates` (optional, keeps things organized)
- **Access mode**: `public`
- **Unique filename**: Check this (optional, but recommended)

### Step 4: Save

Click **"Save"** button at the top

### Step 5: Verify

You should see `unsigned_clubsync` in your list of upload presets with:
- ✅ Signing Mode: Unsigned
- ✅ Status: Active

## 🎯 Alternative: Use Signed Upload (More Secure)

If you prefer NOT to create an unsigned preset, you can use signed uploads on the server instead.

### Option A: Create the Unsigned Preset (Easier)
Follow steps above - takes 2 minutes!

### Option B: Use Signed Upload (More Work)
Would require modifying code to upload through your API instead of directly from browser.

## 🧪 Test After Creating Preset

1. Create the preset in Cloudinary (steps above)
2. Go to: http://localhost:3001/certificate-preview
3. Click "📤 Upload PNG to Cloudinary"
4. Should work now! ✅

## 📸 Visual Guide

When you go to https://console.cloudinary.com/settings/upload you should see something like:

```
┌─────────────────────────────────────────┐
│  Upload Presets                         │
├─────────────────────────────────────────┤
│  [+ Add upload preset]                  │
│                                         │
│  Preset Name: unsigned_clubsync         │
│  Signing Mode: Unsigned  ✓              │
│  Status: Active                         │
│  Folder: certificates                   │
└─────────────────────────────────────────┘
```

## ❓ Why "Unsigned"?

- **Unsigned** = Can upload from browser without authentication
- **Signed** = Requires API secret, must upload through server
- For certificates, unsigned is fine since they're public anyway

## 🔒 Security Note

Unsigned upload presets are safe for certificates because:
- ✅ Certificates are meant to be shared
- ✅ You can restrict file types and sizes in the preset
- ✅ You can set folder restrictions
- ✅ You control what gets uploaded through your app logic

If you're worried about abuse, you can:
- Set upload limits in the preset
- Monitor uploads in Cloudinary dashboard
- Switch to signed uploads later if needed

## ✅ Quick Checklist

- [ ] Logged into Cloudinary console
- [ ] Went to Settings → Upload
- [ ] Clicked "Add upload preset"
- [ ] Named it: `unsigned_clubsync`
- [ ] Set signing mode to: **Unsigned**
- [ ] (Optional) Set folder to: `certificates`
- [ ] Clicked Save
- [ ] Tested upload at `/certificate-preview`

## 🆘 Still Not Working?

If you create the preset and still get errors:

1. **Check the exact name**: Must be exactly `unsigned_clubsync` (case-sensitive)
2. **Check signing mode**: Must be "Unsigned" not "Signed"
3. **Wait 30 seconds**: Sometimes takes a moment to activate
4. **Refresh your app**: Clear cache, reload page
5. **Check cloud name**: Make sure it's `dndtt6j1z`

Let me know once you've created it and I can help test!

