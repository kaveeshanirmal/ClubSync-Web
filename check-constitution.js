const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkConstitutionDocs() {
  try {
    const clubRequests = await prisma.clubRequest.findMany({
      select: {
        id: true,
        clubName: true,
        constitutionDoc: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });

    console.log('Recent club requests and their constitution documents:');
    clubRequests.forEach(request => {
      console.log(`\nID: ${request.id}`);
      console.log(`Club Name: ${request.clubName}`);
      console.log(`Constitution Doc: ${request.constitutionDoc || 'NULL'}`);
      console.log(`Created: ${request.createdAt}`);
    });
  } catch (error) {
    console.error('Error checking constitution documents:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkConstitutionDocs();
