import { PrismaClient, Badges } from '@prisma/client';
import { set } from 'zod';

const prisma = new PrismaClient();

// 뱃지 계산 함수
function calculateBadge(group, participantCount, recordCount) {
  const newBadges = new Set(group.badges);
  // 좋아요 배지 로직
  if (group.likeCount >= 100) {
    newBadges.add(Badges.LIKE_100);
  } else {
    newBadges.delete(Badges.LIKE_100);
  }

  // 참여자 배지 로직
  if (participantCount >= 2) {
    newBadges.add(Badges.PARTICIPATION_10);
  } else {
    newBadges.delete(Badges.PARTICIPATION_10);
  }

  // 운동 기록 배지 로직
  if (recordCount >= 100) {
    newBadges.add(Badges.RECORD_100);
  } else {
    newBadges.delete(Badges.RECORD_100);
  }
  return newBadges;
}

export const getBadges = async (groupId) => {
  await prisma.$transaction(async (tx) => {
    // 1. 필요한 모든 데이터 한 번에 가져오기
    const group = await tx.group.findUnique({
      where: { group_id: groupId },
      select: {
        badges: true,
        likeCount: true,
      },
    });

    const participantCounts = await tx.groupUser.count({
      where: { group_id: groupId },
    });

    const recordCount = await tx.exercise.count({
      where: { group_id: groupId },
    });

    // 2. 새 배지 계산
    const newBadges = calculateBadge(group, participantCounts, recordCount);

    // 3. 기존 배지 배열과 다르면 한 번에 업데이트
    if (
      newBadges.size !== group.badges.length ||
      !Array.from(newBadges).every((badge) => group.badges.includes(badge))
    ) {
      await tx.group.update({
        where: { group_id: groupId },
        data: {
          badges: {
            set: Array.from(newBadges),
          },
        },
      });
    }
  });
};
