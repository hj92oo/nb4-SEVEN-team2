import { PrismaClient, Badges } from '@prisma/client';

const prisma = new PrismaClient();

export const getBadges = async (groupId) => {
  const group = await prisma.group.findUnique({
    where: { group_id: groupId },
  });

  if (!group) {
    console.error(`Group with ID ${groupId} not found.`);
    return;
  }
  
  // 1. 좋아요 배지 획득/제거
  if (group.likeCount >= 1 && !group.badges.includes(Badges.LIKE_100)) {
    await prisma.group.update({
      where: { group_id: groupId },
      data: {
        badges: {
          push: Badges.LIKE_100,
        },
      },
    });
  } else if (group.likeCount < 1 && group.badges.includes(Badges.LIKE_100)) {
    await prisma.group.update({
      where: { group_id: groupId },
      data: {
        badges: {
          set: group.badges.filter((badge) => badge !== Badges.LIKE_100),
        },
      },
    });
  }

  // 2. 참여자 배지 획득/제거
  const participantCounts = await prisma.groupUser.count({
    where: { group_id: groupId },
  });
  if (participantCounts >= 1 && !group.badges.includes(Badges.PARTICIPATION_10)) {
    await prisma.group.update({
      where: { group_id: groupId },
      data: {
        badges: {
          push: Badges.PARTICIPATION_10,
        },
      },
    });
  } else if (participantCounts < 1 && group.badges.includes(Badges.PARTICIPATION_10)) {
    await prisma.group.update({
      where: { group_id: groupId },
      data: {
        badges: {
          set: group.badges.filter((badge) => badge !== Badges.PARTICIPATION_10),
        },
      },
    });
  }
  
  // 3. 운동 기록 배지 획득/제거
  const recordCount = await prisma.exercise.count({
    where: { group_id: groupId },
  });
  if (recordCount >= 1 && !group.badges.includes(Badges.RECORD_100)) {
    await prisma.group.update({
      where: { group_id: groupId },
      data: {
        badges: {
          push: Badges.RECORD_100,
        },
      },
    });
  } else if (recordCount < 1 && group.badges.includes(Badges.RECORD_100)) {
    await prisma.group.update({
      where: { group_id: groupId },
      data: {
        badges: {
          set: group.badges.filter((badge) => badge !== Badges.RECORD_100),
        },
      },
    });
  }
};

