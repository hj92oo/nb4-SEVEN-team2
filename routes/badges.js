import { PrismaClient, Badges } from '@prisma/client';
import { set } from 'zod';

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
}

// /////// 하원님 transaction test 중  //////////

// export const getBadges = async (groupId) => {
//   await prisma.$transaction(async (tx) => {
//     // 1. 필요한 모든 데이터 한 번에 가져오기
//     const group = await tx.group.findUnique({
//       where: { group_id: groupId },
//       select: {
//         badges: true,
//         likeCount: true,
//       },
//     });

//     const participantCount = await tx.groupUser.count({
//       where: { group_id: groupId },
//     });

//     const recordCount = await tx.exercise.count({
//       where: { group_id: groupId },
//     });

//     // 2. 새 배지 계산 로직
//     const newBadges = new Set(group.badges);

//     // 좋아요 배지 로직
//     if (group.likeCount >= 100) {
//       newBadges.add(Badges.LIKE_100);
//     } else {
//       newBadges.delete(Badges.LIKE_100);
//     }

//     // 참여자 배지 로직
//     if (participantCount >= 10) {
//       newBadges.add(Badges.PARTICIPATION_10);
//     } else {
//       newBadges.delete(Badges.PARTICIPATION_10);
//     }

//     // 운동 기록 배지 로직
//     if (recordCount >= 100) {
//       newBadges.add(Badges.RECORD_100);
//     } else {
//       newBadges.delete(Badges.RECORD_100);
//     }

//     // 3. 기존 배지 배열과 다르면 한 번에 업데이트
//     if (
//       newBadges.size !== group.badges.length ||
//       !Array.from(newBadges).every((badge) => group.badges.includes(badge))
//     ) {
//       await tx.group.update({
//         where: { group_id: groupId },
//         data: {
//           badges: {
//             set: Array.from(newBadges),
//           },
//         },
//       });
//     }
//   });
// };



export default {
  likeBadges,
  participantBadges,
};

