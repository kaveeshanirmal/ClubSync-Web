import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting volunteer stats seeding...\n');

  // Get all users
  const users = await prisma.user.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true
    }
  });

  console.log(`Found ${users.length} users\n`);

  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const user of users) {
    try {
      // Check if stats already exist
      const existingStats = await (prisma as any).volunteerStats.findUnique({
        where: { userId: user.id }
      });

      if (existingStats) {
        console.log(`⏭️  Skipped: ${user.firstName} ${user.lastName} (stats already exist)`);
        skipped++;
        continue;
      }

      // Get user's event registrations
      const registrations = await prisma.eventRegistration.findMany({
        where: { volunteerId: user.id },
        select: { eventRole: true }
      });

      // Count events by role
      const participated = registrations.filter(r => r.eventRole === 'participant').length;
      const organized = registrations.filter(r => r.eventRole === 'organizer').length;
      const totalPoints = (participated * 10) + (organized * 50);

      // Create stats record
      await (prisma as any).volunteerStats.create({
        data: {
          userId: user.id,
          eventsParticipated: participated,
          eventsOrganized: organized,
          totalPoints: totalPoints
        }
      });

      console.log(`✅ Created: ${user.firstName} ${user.lastName} - ${participated} participated, ${organized} organized, ${totalPoints} points`);
      created++;

    } catch (error) {
      console.error(`❌ Error for user ${user.firstName} ${user.lastName}:`, error);
      errors++;
    }
  }

  console.log('\n📊 Seeding Summary:');
  console.log(`   Created: ${created}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Errors: ${errors}`);
  console.log(`   Total: ${users.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
