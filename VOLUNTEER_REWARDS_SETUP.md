# 🎖️ Volunteer Reward System - Setup Guide

## Overview
A simple badge and points system for volunteers based on event participation.

### Reward Structure
- **Points**:
  - 10 points per event participation
  - 50 points per event organized
- **Badges**:
  - 🥉 **Bronze**: 0-9 events
  - 🥈 **Silver**: 10-24 events  
  - 🥇 **Gold**: 25-49 events
  - 💎 **Platinum**: 50+ events

---

## 🚀 Quick Start (First Time Setup)

### Step 1: Restart Development Server
```powershell
# Stop your current dev server (Ctrl+C)
# Then restart it
npm run dev
```

**Why?** This regenerates the Prisma client with the new `VolunteerStats` model.

### Step 2: Sync Database Migration
```powershell
npx prisma migrate dev
```

If prompted, name the migration: `add_volunteer_stats`

### Step 3: Seed Existing Users (Optional but Recommended)
```powershell
npx tsx prisma/seed-volunteer-stats.ts
```

This creates volunteer stats for all existing users based on their past event registrations.

**Sample Output:**
```
🌱 Starting volunteer stats seeding...
Found 15 users

✅ Created: John Doe - 3 participated, 1 organized, 80 points
✅ Created: Jane Smith - 5 participated, 0 organized, 50 points
⏭️  Skipped: Bob Wilson (stats already exist)

📊 Seeding Summary:
   Created: 12
   Skipped: 2
   Errors: 0
   Total: 15
```

### Step 4: Verify Setup
Visit any user profile page. You should see their volunteer stats displayed with badge, points, and progress bar.

---

## 📂 New Files Added

### Database
- `prisma/schema.prisma` - Added `VolunteerStats` model
- `prisma/migrations/[timestamp]_add_volunteer_stats/` - Migration files
- `prisma/seed-volunteer-stats.ts` - Seeding script

### Backend
- `app/lib/volunteerUtils.ts` - Badge calculation logic
- `app/types/volunteer.ts` - TypeScript types
- `app/api/volunteers/stats/[userId]/route.ts` - Stats API endpoint
- `app/api/events/register/route.ts` - Event registration with point awards

### Frontend
- `app/components/volunteer/VolunteerBadge.tsx` - Badge display component
- `app/components/volunteer/PointsDisplay.tsx` - Points counter
- `app/components/volunteer/VolunteerStats.tsx` - Complete stats card
- `app/hooks/useVolunteerStats.ts` - Stats fetching hook

---

## 🔄 How It Works

### Automatic Point Awards
When a volunteer registers for an event:

1. **Registration Created**: Event registration record saved
2. **Stats Updated**: VolunteerStats automatically updated via Prisma upsert
3. **Points Awarded**:
   - Participant role: +10 points, +1 to eventsParticipated
   - Organizer role: +50 points, +1 to eventsOrganized
4. **Badge Calculated**: Badge level computed based on total events

### API Endpoints

#### Get Volunteer Stats
```http
GET /api/volunteers/stats/[userId]
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalPoints": 130,
    "eventsParticipated": 8,
    "eventsOrganized": 1,
    "badge": {
      "level": "bronze",
      "name": "Bronze Volunteer",
      "emoji": "🥉",
      "description": "Starting your journey"
    },
    "nextBadge": {
      "level": "silver",
      "name": "Silver Volunteer",
      "emoji": "🥈",
      "eventsNeeded": 2
    },
    "progress": 80
  }
}
```

#### Register for Event
```http
POST /api/events/register
Content-Type: application/json

{
  "eventId": "evt_123",
  "eventRole": "participant"
}
```

---

## 🧪 Testing Checklist

### Database Tests
- [ ] Run `npx prisma studio` and verify `VolunteerStats` table exists
- [ ] Check that existing users have stats records after seeding
- [ ] Verify foreign key relationship (userId → User.id)

### API Tests
- [ ] Get stats for existing user returns correct data
- [ ] Get stats for new user creates stats from history
- [ ] Register for event awards correct points
- [ ] Badge level calculation matches expected thresholds

### UI Tests  
- [ ] Profile page displays volunteer stats card
- [ ] Badge emoji and colors display correctly
- [ ] Points counter shows formatted numbers
- [ ] Progress bar reflects accurate percentage
- [ ] Next badge info shows correct events needed
- [ ] Loading state shows while fetching
- [ ] Error state shows if fetch fails
- [ ] Dark mode styling works properly

### Integration Tests
- [ ] New user registration creates empty stats (0 points)
- [ ] Event registration as participant awards 10 points
- [ ] Event registration as organizer awards 50 points
- [ ] Badge upgrades when crossing thresholds
- [ ] Existing features still work (no breaking changes)

---

## 🔧 Troubleshooting

### "Property 'volunteerStats' does not exist on type 'PrismaClient'"

**Cause**: Prisma client not regenerated after schema changes.

**Solution**:
```powershell
npx prisma generate
```

### "Migration drift detected"

**Cause**: Migration exists in database but not in migration history.

**Solution**:
```powershell
npx prisma migrate dev
```

Choose option to apply new migration.

### Stats not updating after event registration

**Check**:
1. Verify event registration API is being called: `/api/events/register`
2. Check browser console for errors
3. Look at server logs for failed upsert operations
4. Verify session userId matches event registration volunteerId

### Badge not displaying correctly

**Check**:
1. Inspect browser console for component errors
2. Verify stats API returns correct badge data
3. Check Tailwind CSS classes are being applied
4. Ensure emoji fonts are supported in browser

---

## 📊 Database Schema

```prisma
model VolunteerStats {
  id                   String   @id @default(cuid())
  userId               String   @unique
  user                 User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  totalPoints          Int      @default(0)
  eventsParticipated   Int      @default(0)
  eventsOrganized      Int      @default(0)
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
}
```

**Indexes**: Unique on `userId` for fast lookups  
**Cascade Delete**: Stats deleted when user is deleted

---

## 🎯 Next Steps (Future Enhancements)

### Potential Features (Not Implemented)
- 🏆 Leaderboard page showing top volunteers
- 📈 Stats history tracking (monthly/yearly breakdown)
- 🎓 Achievement system (milestones, special badges)
- 📧 Email notifications for badge upgrades
- 📊 Admin dashboard for volunteer analytics
- 🎁 Reward redemption system
- 📱 Mobile app integration

### To Add Later (If Needed)
1. **Leaderboard**: Query VolunteerStats ordered by totalPoints
2. **Achievements**: New table with achievement definitions and user unlocks
3. **History**: New table tracking point changes over time
4. **Notifications**: Trigger on badge level change

---

## 📝 Maintenance Notes

### Weekly/Monthly Tasks
- Monitor stats accuracy (spot check registrations vs stats)
- Check for orphaned stats records (users without registrations)
- Review badge distribution (ensure thresholds make sense)

### Data Cleanup
```sql
-- Find users with stats but no registrations (rare edge case)
SELECT vs.*, u.email 
FROM "VolunteerStats" vs
JOIN "User" u ON vs."userId" = u.id
WHERE NOT EXISTS (
  SELECT 1 FROM "EventRegistration" 
  WHERE "volunteerId" = vs."userId"
);

-- Recalculate all stats (if needed)
-- Use the seed script: npx tsx prisma/seed-volunteer-stats.ts
```

---

## 🤝 Support

For issues or questions:
1. Check this guide first
2. Review error messages in console/logs
3. Verify database schema with `npx prisma studio`
4. Test API endpoints with Postman/Thunder Client

---

**Version**: 1.0.0  
**Last Updated**: January 2025  
**Status**: ✅ Production Ready
