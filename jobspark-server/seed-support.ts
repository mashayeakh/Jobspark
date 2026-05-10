import { prisma } from './src/app/lib/prisma';

async function main() {
  console.log('Seeding support data...');

  const userCount = await prisma.user.count();
  if (userCount === 0) {
    console.log('No users found. Cannot seed support sessions without users.');
    return;
  }

  const users = await prisma.user.findMany({ take: 3 });

  // Clear existing to avoid duplicates during testing
  await prisma.chatMessage.deleteMany({});
  await prisma.supportTicket.deleteMany({});
  await prisma.supportSession.deleteMany({});

  const session1 = await prisma.supportSession.create({
    data: {
      userId: users[0].id,
      status: 'ACTIVE',
      messages: {
        create: [
          { message: 'Hello, I want to cancel my subscription', isUser: true, timestamp: new Date(Date.now() - 600000) },
          { message: 'I can help you with that. Are you sure you want to cancel?', isUser: false, intent: 'BILLING', confidence: 0.95, timestamp: new Date(Date.now() - 500000) },
          { message: 'Yes, please proceed.', isUser: true, timestamp: new Date(Date.now() - 400000) },
        ]
      }
    }
  });

  const session2 = await prisma.supportSession.create({
    data: {
      userId: users[1] ? users[1].id : users[0].id,
      status: 'ESCALATED',
      messages: {
        create: [
          { message: 'My job post was rejected and I do not know why', isUser: true, timestamp: new Date(Date.now() - 3600000) },
          { message: 'I am sorry to hear that. I will escalate this to a human agent immediately.', isUser: false, intent: 'ESCALATION', confidence: 0.99, timestamp: new Date(Date.now() - 3500000) },
        ]
      },
      ticket: {
        create: {
          userId: users[1] ? users[1].id : users[0].id,
          reason: 'Job Post Rejected',
          priority: 'URGENT'
        }
      }
    }
  });

  const session3 = await prisma.supportSession.create({
    data: {
      userId: users[2] ? users[2].id : users[0].id,
      status: 'RESOLVED',
      messages: {
        create: [
          { message: 'How do I reset my password?', isUser: true, timestamp: new Date(Date.now() - 86400000) },
          { message: 'You can reset your password by going to the login page and clicking "Forgot Password".', isUser: false, intent: 'PASSWORD_RESET', confidence: 0.98, timestamp: new Date(Date.now() - 86300000) },
          { message: 'Thanks it worked!', isUser: true, timestamp: new Date(Date.now() - 86200000) },
        ]
      }
    }
  });

  console.log('Seeded support data successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
