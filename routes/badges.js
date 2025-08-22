import { PrismaClient, Badges } from '@prisma/client';

const prisma = new PrismaClient();

const likeBadges = async (groupId) => {
  const group = await prisma.group.findUnique({
    where: { group_id: groupId },
  });
  // 좋아요 배지 획득
  if (group.likeCount >= 100 && !group.badges.includes(Badges.LIKE_100)) {
    await prisma.group.update({
      where: { group_id: groupId },
      data: {
        badges: {
          push: Badges.LIKE_100,
        },
      },
    });
  } else if (group.likeCount < 100 && group.badges.includes(Badges.LIKE_100)) {
    await prisma.group.update({
      where: { group_id: groupId },
      data: {
        badges: {
          // 좋아요 배지 제거
          set: group.badges.filter((badge) => badge !== Badges.LIKE_100),
        },
      },
    });
  }
}

const participantBadges = async (groupId) => {
  const group = await prisma.group.findUnique({
    where: { group_id: groupId },
  });
  const participantCounts = await prisma.groupUser.count({
    where: { group_id: groupId },
  });
  if (participantCounts >= 10 && !group.badges.includes(Badges.PARTICIPATION_10)) {
    await prisma.group.update({
      where: { group_id: groupId },
      data: {
        badges: {
          push: Badges.PARTICIPATION_10,
        },
      },
    });  // 참여자 배지 제거
  } else if (participantCounts < 10 && group.badges.includes(Badges.PARTICIPATION_10)) {
    await prisma.group.update({
      where: { group_id: groupId },
      data: {
        badges: {
          set: group.badges.filter((badge) => badge !== Badges.PARTICIPATION_10)
        },
      },
    });
  }
};

const recordBadges = async (groupId) => {
  const group = await prisma.group.findUnique({
    where: { group_id: groupId },
  });
  const recordCounts = await prisma.exercise.count({
    where: { group_id: groupId },
  });
  if (recordCounts >= 100 && !group.badges.includes(Badges.RECORD_100)) {
    await prisma.group.update({
      where: { group_id: groupId },
      data: {
        badges: {
          push: Badges.RECORD_100,
        },
      },
    });
  } else if (recordCounts < 10 && group.badges.includes(Badges.RECORD_10)) {
    await prisma.group.update({
      where: { group_id: groupId },
      data: {
        badges: {
          set: group.badges.filter((badge) => badge !== Badges.RECORD_10)
        },
      },
    });
  }
};

export default {
  likeBadges,
  participantBadges,
  recordBadges,
};