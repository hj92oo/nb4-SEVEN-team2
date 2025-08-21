import { PrismaClient, Badges } from '@prisma/client';

const prisma = new PrismaClient();

export const getBadges = async (groupId) => {
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
  } // 참여자 배지 획득
  const participantCounts = await prisma.groupUser.count({
    where: { group_id: groupId },
  });
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
    }); // 참여자 배지 획득
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
  // 운동 기록
  const recordCount = await prisma.exercise.count({
    where: { group_id: groupId },
  });
  if (recordCount >= 2 && !group.badges.includes(Badges.RECORD_100)) {
    await prisma.group.update({
      where: { group_id: groupId },
      data: {
        badges: {
          push: Badges.RECORD_100,
        },
      },
    });
  }
};
