import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const seedData = [
  {
    id: 3,
    name: 'Tech Innovators',
    nickname: 'coder_kim',
    password: 'securepass',
    description: '최신 기술과 개발 이야기 공유하는 그룹',
    photoUrl: 'https://example.com/photos/tech_innovators.png',
    goalRep: 50,
    discordWebhookUrl: 'https://discord.com/api/webhooks/abc/def',
    discordInviteUrl: 'https://discord.gg/xyz789',
    likeCount: 0,
    tags: ['tech', 'programming', 'innovation'],
    badges: [],
    createdAt: new Date('2025-08-17T23:54:45.146Z'),
    updatedAt: new Date('2025-08-17T23:54:45.146Z'),
  },
  {
    id: 2,
    name: 'Book Club 2025',
    nickname: 'bookworm_joe',
    password: 'readmore',
    description: '한 달에 한 권 책 읽고 토론하는 모임',
    photoUrl: 'https://example.com/photos/book_club.jpg',
    goalRep: 12,
    discordWebhookUrl: 'https://discord.com/api/webhooks/zzz/xxx',
    discordInviteUrl: 'https://discord.gg/def456',
    likeCount: 0,
    tags: ['books', 'reading', 'discussion'],
    badges: [],
    createdAt: new Date('2025-08-17T23:54:45.145Z'),
    updatedAt: new Date('2025-08-17T23:54:45.145Z'),
  },
  {
    id: 1,
    name: 'Morning Fitness Crew',
    nickname: 'fit_amy',
    password: 'pass1234',
    description: '아침 운동 함께하는 활기찬 그룹',
    photoUrl: 'https://example.com/photos/morning_fitness.jpg',
    goalRep: 100,
    discordWebhookUrl: 'https://discord.com/api/webhooks/xxx/yyy',
    discordInviteUrl: 'https://discord.gg/abc123',
    likeCount: 0,
    tags: ['fitness', 'morning', 'health'],
    badges: [],
    createdAt: new Date('2025-08-17T23:54:45.130Z'),
    updatedAt: new Date('2025-08-17T23:54:45.130Z'),
  },
];

async function main() {
  for (const group of seedData) {
    await prisma.group.upsert({
      where: { id: group.id },
      update: {},
      create: group,
    });
  }
  console.log('Seed data has been inserted.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
