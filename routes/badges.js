import { PrismaClient, Badges } from '@prisma/client';
import { set } from 'zod';

const prisma = new PrismaClient();

// 1. 좋아요 100개 이상 시, 배지 획득 코드
export const likeBadges = async (groupId) => {
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
  } else if (group.likeCount  < 100 && group.badges.includes(Badges.LIKE_100)) {
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
};

// 2. 참여자 10명 이상 시, 배지 획득 코드
export const participantBadges = async (groupId) => {
  const group = await prisma.group.findUnique({
    where: { group_id: groupId },
  });
  const participantCounts = await prisma.groupUser.count({
    where: { group_id: groupId },
  });

  // 참여자 배지 획득
  if (
    participantCounts >= 10 &&
    !group.badges.includes(Badges.PARTICIPATION_10)
  ) {
    await prisma.group.update({
      where: { group_id: groupId },
      data: {
        badges: {
          push: Badges.PARTICIPATION_10,
        },
      },
    }); // 참여자 배지 제거
  } else if (
    participantCounts < 10 &&
    group.badges.includes(Badges.PARTICIPATION_10)
  ) {
    await prisma.group.update({
      where: { group_id: groupId },
      data: {
        badges: {
          set: group.badges.filter(
            (badge) => badge !== Badges.PARTICIPATION_10
          ),
        },
      },
    });
  }
};

//3. 운동 기록 100개 이상 시, 배지 획득 코드
export const recordBadges = async (groupId) => {
  const group = await prisma.group.findUnique({
    where: { group_id: groupId },
  });
  const recordCount = await prisma.exercise.count({
    where: { group_id: groupId },
  });

  // 운동 기록 배지 획득
  if (recordCount >= 100 && !group.badges.includes(Badges.RECORD_100)) {
    await prisma.group.update({
      where: { group_id: groupId },
      data: {
        badges: {
          push: Badges.RECORD_100,
        },
      },
    }); // 운동 기록 배지 제거
  } else if (recordCount < 100 && group.badges.includes(Badges.RECORD_100)) {
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

export default {
  likeBadges,
  participantBadges,
  recordBadges,
};
