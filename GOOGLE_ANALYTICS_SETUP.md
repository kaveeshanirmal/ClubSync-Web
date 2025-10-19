# Google Analytics Setup Guide

## 📊 Overview

Google Analytics (GA4) has been integrated into the ClubSync platform to track user behavior, page views, and custom events. This guide will help you set up and use Google Analytics effectively.

---

## 🚀 Quick Setup

### Step 1: Get Your Google Analytics Measurement ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Sign in with your Google account
3. If you don't have a property yet:
   - Click "Admin" (gear icon in bottom left)
   - Click "Create Property"
   - Fill in property details:
     - Property name: "ClubSync"
     - Time zone: Your time zone
     - Currency: Your currency
   - Click "Next"
   - Choose industry category and business size
   - Click "Create"
4. In the Admin panel:
   - Under "Property" column, click "Data Streams"
   - Click "Add stream" → "Web"
   - Enter your website URL:
     - For testing: `http://localhost:3000` ✅ (GA4 supports localhost!)
     - For production: `https://yoursite.com`
   - Enter stream name: "ClubSync Website" (or "ClubSync Dev" for localhost)
   - Click "Create stream"
5. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`)

**💡 Pro Tip:** You can create two separate data streams:
   - One for development (`http://localhost:3000`)
   - One for production (`https://yoursite.com`)
   
   This keeps your test data separate from production data!

### Step 2: Add Measurement ID to Environment Variables

1. Open your `.env.local` file (create if it doesn't exist)
2. Add the following line:
   ```env
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```
   Replace `G-XXXXXXXXXX` with your actual Measurement ID

   **💡 Note:** GA4 works on localhost! You can test everything locally before deploying.

3. Restart your development server:
   ```bash
   npm run dev
   ```

### Step 3: Verify Installation (Works on Localhost!)

1. Open `http://localhost:3000` in your browser
2. Open Chrome DevTools (F12)
3. Go to the "Network" tab
4. Filter by "gtag" or "analytics"
5. You should see requests to `www.google-analytics.com`
6. Check the "Console" tab - you should see GA initialization

**Method 2: Google Analytics DebugView (Recommended)**
1. Install [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna) Chrome extension
2. Enable the extension
3. Visit `http://localhost:3000`
4. Go to Google Analytics → Admin → DebugView
5. You should see real-time events from localhost! 🎉

**Method 3: Realtime Report**
1. Go to Google Analytics
2. Navigate to Reports → Realtime
3. Open `http://localhost:3000`
4. You should see 1 active user
5. See page views and events in real-time

**✅ Success Signs:**
- Network tab shows GA requests with status 200
- Console shows no GA errors
- DebugView shows your events
- Realtime report shows active users

---

## � Testing on Localhost

### Yes, GA4 Works on Localhost! 🎉

Unlike older Universal Analytics, **Google Analytics 4 fully supports localhost tracking**. You can test everything locally before deploying to production.

### Quick Localhost Setup

1. **Create a data stream for localhost:**
   - GA Admin → Data Streams → Add stream → Web
   - URL: `http://localhost:3000`
   - Stream name: "ClubSync Dev"
   - Click "Create stream"

2. **Copy the Measurement ID** (e.g., `G-ABC123XYZ`)

3. **Add to `.env.local`:**
   ```env
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-ABC123XYZ
   ```

4. **Restart dev server:**
   ```bash
   npm run dev
   ```

5. **Test it:**
   - Open `http://localhost:3000`
   - Open DevTools → Network tab
   - You'll see requests to Google Analytics
   - Or use DebugView for real-time events

### Separate Dev and Production Streams

**Recommended Approach:** Create two data streams to keep test data separate:

#### Development Stream
- URL: `http://localhost:3000`
- Name: "ClubSync Dev"
- Measurement ID: `G-DEV123ABC`

#### Production Stream
- URL: `https://yoursite.com`
- Name: "ClubSync Production"
- Measurement ID: `G-PROD456XYZ`

**Environment Variables:**
```env
# .env.local (for localhost)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-DEV123ABC

# Production environment
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-PROD456XYZ
```

### Why Use Localhost Tracking?

✅ **Test Events:** Verify all custom events work correctly  
✅ **Debug Issues:** Catch problems before production  
✅ **See Real Data:** Test with actual interactions  
✅ **Team Testing:** Multiple developers can test  
✅ **No Impact:** Doesn't affect production analytics

### Viewing Localhost Data

1. **DebugView** (Best for development):
   - GA → Admin → DebugView
   - Install GA Debugger extension
   - See events in real-time

2. **Realtime Report**:
   - GA → Reports → Realtime
   - See active users and current events

3. **Regular Reports**:
   - All standard GA reports work
   - Data processes normally

---

## �📁 Files Structure

```
ClubSync-Web/
├── app/
│   ├── components/
│   │   └── GoogleAnalytics.tsx      # GA component
│   └── layout.tsx                   # Root layout with GA
├── lib/
│   └── analytics.ts                 # Analytics utility functions
└── .env.example                     # Environment variables example
```

---

## 🔧 Implementation Details

### GoogleAnalytics Component

**Location:** `app/components/GoogleAnalytics.tsx`

This component:
- ✅ Loads Google Analytics scripts
- ✅ Initializes GA with your Measurement ID
- ✅ Automatically tracks page views on route changes
- ✅ Uses Next.js Script component for optimal loading
- ✅ TypeScript support with proper type definitions

**Key Features:**
- Uses `next/script` with `afterInteractive` strategy for performance
- Tracks navigation changes automatically with Next.js router
- Only loads when Measurement ID is provided

### Root Layout Integration

**Location:** `app/layout.tsx`

The GoogleAnalytics component is added to the root layout:
```tsx
{gaId && <GoogleAnalytics measurementId={gaId} />}
```

This ensures GA is loaded on every page of your application.

---

## 📈 Tracking Custom Events

### Using Analytics Utility Functions

**Location:** `lib/analytics.ts`

Import the functions you need:
```typescript
import { trackEvent, trackClubView, trackEventRegistration } from '@/lib/analytics';
```

### Available Functions

#### 1. **Generic Event Tracking**
```typescript
trackEvent('button_click', {
  button_name: 'Join Club',
  button_location: 'club_page'
});
```

#### 2. **Club View Tracking**
```typescript
trackClubView(club.id, club.name);
```

#### 3. **Event Registration**
```typescript
trackEventRegistration(event.id, event.title);
```

#### 4. **Club Join Request**
```typescript
trackClubJoinRequest(club.id, club.name);
```

#### 5. **Search Tracking**
```typescript
trackSearch('tech clubs', 'clubs');
```

#### 6. **User Authentication**
```typescript
// On login
trackLogin('google');

// On signup
trackSignup('google');
```

#### 7. **Form Submissions**
```typescript
trackFormSubmit('contact_form', 'inquiry');
```

#### 8. **File Downloads**
```typescript
trackDownload('club_constitution.pdf', 'pdf');
```

#### 9. **Certificate Generation**
```typescript
trackCertificateGeneration(event.id, event.name);
```

#### 10. **Vote Casting**
```typescript
trackVoteCast(election.id, position.id);
```

#### 11. **Social Sharing**
```typescript
trackShare('facebook', 'event', event.id);
```

#### 12. **Error Tracking**
```typescript
trackException('Failed to load clubs', false);
```

#### 13. **Page View Tracking (Manual)**
```typescript
trackPageView('/clubs', 'All Clubs');
```

---

## 💡 Usage Examples

### Example 1: Track Club Details View

```tsx
// In clubs/[id]/page.tsx
'use client';

import { useEffect } from 'react';
import { trackClubView } from '@/lib/analytics';

export default function ClubDetailPage({ club }) {
  useEffect(() => {
    // Track when user views club details
    trackClubView(club.id, club.name);
  }, [club.id, club.name]);

  return (
    <div>
      <h1>{club.name}</h1>
      {/* Club details */}
    </div>
  );
}
```

### Example 2: Track Event Registration Button Click

```tsx
// In events/[id]/page.tsx
import { trackEventRegistration } from '@/lib/analytics';

export default function EventPage({ event }) {
  const handleRegister = async () => {
    try {
      // Register for event
      await registerForEvent(event.id);
      
      // Track successful registration
      trackEventRegistration(event.id, event.title);
      
      // Show success message
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <button onClick={handleRegister}>
      Register for Event
    </button>
  );
}
```

### Example 3: Track Search

```tsx
// In components/SearchBar.tsx
import { trackSearch } from '@/lib/analytics';

export default function SearchBar() {
  const handleSearch = (query: string) => {
    // Perform search
    searchClubs(query);
    
    // Track search
    trackSearch(query, 'clubs');
  };

  return (
    <input
      type="search"
      onChange={(e) => handleSearch(e.target.value)}
      placeholder="Search clubs..."
    />
  );
}
```

### Example 4: Track Form Submission

```tsx
// In app/contact/page.tsx
import { trackFormSubmit } from '@/lib/analytics';

export default function ContactPage() {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Submit form
      await submitInquiry(formData);
      
      // Track successful submission
      trackFormSubmit('contact_form', 'general_inquiry');
      
      // Show success message
    } catch (error) {
      console.error('Submission failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

### Example 5: Track Certificate Download

```tsx
// In app/certificate-wallet/page.tsx
import { trackDownload } from '@/lib/analytics';

export default function CertificateWallet() {
  const handleDownloadCertificate = (cert: Certificate) => {
    // Download certificate
    downloadFile(cert.url);
    
    // Track download
    trackDownload(`certificate_${cert.eventName}.pdf`, 'pdf');
  };

  return (
    <button onClick={() => handleDownloadCertificate(certificate)}>
      Download Certificate
    </button>
  );
}
```

---

## 📊 What Gets Tracked Automatically

### Automatic Tracking

1. **Page Views**: Every route change is automatically tracked
2. **User Sessions**: GA tracks user sessions automatically
3. **Device Information**: Device type, browser, OS
4. **Geographic Data**: Country, city, language
5. **Traffic Sources**: Where users came from
6. **User Demographics**: Age, gender (if available)

### Custom Events You Need to Track Manually

1. **Button Clicks**: Important CTAs
2. **Form Submissions**: Contact, registration forms
3. **Downloads**: PDFs, certificates, documents
4. **Video Plays**: If you have video content
5. **Scroll Depth**: How far users scroll
6. **Error Events**: When errors occur
7. **Search Queries**: What users search for
8. **Social Shares**: When users share content

---

## 🎯 Recommended Events to Track

Based on ClubSync's features, here are the most valuable events to track:

### High Priority
- ✅ **Club Views**: Track which clubs are most popular
- ✅ **Event Registrations**: Monitor event popularity
- ✅ **Join Requests**: Track club membership interest
- ✅ **Certificate Downloads**: Measure engagement
- ✅ **Vote Casts**: Monitor election participation
- ✅ **Search Queries**: Understand what users look for

### Medium Priority
- ⚠️ **Form Submissions**: Contact forms, inquiries
- ⚠️ **Social Shares**: Track virality
- ⚠️ **Profile Updates**: User engagement
- ⚠️ **Document Downloads**: Constitution, documents

### Low Priority (Nice to Have)
- 💡 **Scroll Depth**: Content engagement
- 💡 **Time on Page**: Detailed engagement metrics
- 💡 **Exit Pages**: Where users leave

---

## 📱 Privacy & Compliance

### GDPR Compliance

1. **Cookie Consent**: Consider adding a cookie consent banner
2. **Privacy Policy**: Update to mention Google Analytics
3. **Data Anonymization**: GA4 has IP anonymization by default
4. **User Rights**: Allow users to opt-out

### Cookie Banner Example

```tsx
// components/CookieConsent.tsx
'use client';

import { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShowBanner(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <p className="text-sm">
          We use cookies to improve your experience and analyze site traffic.
        </p>
        <div className="flex gap-4">
          <button
            onClick={declineCookies}
            className="px-4 py-2 bg-gray-700 rounded"
          >
            Decline
          </button>
          <button
            onClick={acceptCookies}
            className="px-4 py-2 bg-orange-500 rounded"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## 🔍 Testing Google Analytics

### In Development

1. **Chrome DevTools**:
   - Open DevTools (F12)
   - Network tab → Filter by "gtag"
   - See GA requests

2. **Google Analytics Debugger Extension**:
   - Install from Chrome Web Store
   - Enable extension
   - View detailed event information in console

3. **GA DebugView**:
   - Go to GA Admin → DebugView
   - See real-time events

### In Production

1. **Real-time Reports**:
   - GA → Reports → Realtime
   - See current active users

2. **Event Reports**:
   - GA → Reports → Events
   - See all tracked events

3. **Page Views**:
   - GA → Reports → Pages and screens
   - See most visited pages

---

## 📈 Viewing Analytics Data

### Google Analytics Dashboard

1. Go to [analytics.google.com](https://analytics.google.com/)
2. Select your property (ClubSync)
3. View different reports:

#### Realtime Report
- See live user activity
- Current page views
- Events happening now

#### Acquisition Report
- Where users come from
- Traffic sources
- Campaigns

#### Engagement Report
- Page views
- Events
- User engagement metrics

#### User Report
- Demographics
- Devices
- Locations

#### Custom Events
- Go to Reports → Events
- See all your custom tracked events
- Filter by event name

---

## 🎨 Custom Dashboards

Create custom dashboards in GA4:

1. Go to "Explore" in GA4
2. Click "Blank" template
3. Add dimensions:
   - Event name
   - Page path
   - Device category
4. Add metrics:
   - Event count
   - Users
   - Sessions
5. Create visualizations
6. Save your dashboard

---

## 🚨 Troubleshooting

### GA Not Working?

**Check 1: Environment Variable**
```bash
# Verify the variable is set
echo $NEXT_PUBLIC_GA_MEASUREMENT_ID
```

**Check 2: Browser Console**
```javascript
// In browser console
console.log(window.gtag);
// Should show function, not undefined
```

**Check 3: Ad Blockers**
- Disable ad blockers
- GA might be blocked

**Check 4: Network Requests**
- Open DevTools → Network
- Look for requests to `www.google-analytics.com`
- Check if they're blocked

**Check 5: Measurement ID Format**
- Should start with `G-`
- Example: `G-ABC123XYZ`

### Events Not Showing Up?

1. **Wait 24 hours**: Some events take time to process
2. **Check DebugView**: See real-time events
3. **Verify event names**: Must match GA4 event naming
4. **Check parameters**: Ensure parameters are correct type

---

## 🔐 Security Best Practices

1. ✅ Use environment variables (not hardcode ID)
2. ✅ Keep Measurement ID in `.env.local` (not `.env`)
3. ✅ Add `.env.local` to `.gitignore`
4. ✅ Use `NEXT_PUBLIC_` prefix for client-side variables
5. ✅ Don't track sensitive user data
6. ✅ Follow GDPR guidelines

---

## 📚 Additional Resources

- [Google Analytics 4 Documentation](https://support.google.com/analytics/answer/10089681)
- [GA4 Event Reference](https://support.google.com/analytics/answer/9267735)
- [Next.js Analytics Guide](https://nextjs.org/docs/app/building-your-application/optimizing/analytics)
- [GA4 Best Practices](https://support.google.com/analytics/answer/9267744)

---

## ✅ Checklist

Before deploying to production:

- [ ] Get GA4 Measurement ID
- [ ] Add to environment variables
- [ ] Test in development
- [ ] Verify events in DebugView
- [ ] Add cookie consent banner (if required)
- [ ] Update privacy policy
- [ ] Test in production
- [ ] Monitor for first 24 hours
- [ ] Set up custom reports
- [ ] Train team on GA dashboard

---

## 🎉 Summary

Google Analytics is now fully integrated into ClubSync! 

**What You Get:**
- ✅ Automatic page view tracking
- ✅ 15+ custom event tracking functions
- ✅ TypeScript support
- ✅ Performance optimized
- ✅ Easy to use API
- ✅ Privacy-friendly implementation

**Next Steps:**
1. Add your Measurement ID to `.env.local`
2. Start tracking custom events in your components
3. Monitor analytics in GA dashboard
4. Make data-driven decisions!

Happy tracking! 📊
