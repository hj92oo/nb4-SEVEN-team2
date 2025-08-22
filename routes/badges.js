// import { PrismaClient, Badges } from '@prisma/client';

// const prisma = new PrismaClient();


// // 1. 좋아요 배지 획득 뱃지
// export const getBadges = async (groupId) => {
//   const group = await prisma.group.findUnique({
//     where: { group_id: groupId },
//   });
//   if (group.likeCount >= 100 && !group.badges.includes(Badges.LIKE_100)) {
//     await prisma.group.update({
//       where: { group_id: groupId },
//       data: {
//         badges: {
//           push: Badges.LIKE_100,
//         },
//       },
//     });
//   } else if (group.likeCount < 100 && group.badges.includes(Badges.LIKE_100)) {
//     await prisma.group.update({
//       where: { group_id: groupId },
//       data: {
//         badges: {
//           // 좋아요 배지 제거
//           set: group.badges.filter((badge) => badge !== Badges.LIKE_100),
//         },
//       },
//     });
//   } 
  
//   // 2.참여자 배지 획득
//   const participantCounts = await prisma.groupUser.count({
//     where: { group_id: groupId },
//   });
//   if (participantCounts >= 10 && !group.badges.includes(Badges.PARTICIPATION_10)) {
//     await prisma.group.update({
//       where: { group_id: groupId },
//       data: {
//         badges: {
//           push: Badges.PARTICIPATION_10,
//         },
//       },
//     });  // 참여자 배지 획득
//   } else if (participantCounts < 10 && group.badges.includes(Badges.PARTICIPATION_10)) {
//     await prisma.group.update({
//       where: { group_id: groupId },
//       data: {
//         badges: {
//           set: group.badges.filter((badge) => badge !== Badges.PARTICIPATION_10),
//         },
//       },
//     });
//   }
  
//   //3. 운동 기록
//       await prisma.group.update({
//         where: { group_id: groupId },
//         data: {
//           badges: {
//           push: Badges.PARTICIPATION_10,
//         },
//       },
//     });
//   }
//   // 운동 기록
//   const recordCount = await prisma.group.count({
//     where: { group_id: groupId },
//   })
//   if ( recordCount >= 1 && !group.badges.includes(Badges.RECORD_100)){
//     await prisma.group.update({
//       where: { group_id: groupId },
//       data: {
//         badges: {
//           push: Badges.RECORD_100,
//         },
//       },
//     });
//   }
// };

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

  const participantCounts = await prisma.groupUser.count({
    where: { group_id: groupId },
  });

  const recordCount = await prisma.exercise.count({
    where: { group_id: groupId },
  });

  const badgeConditions = [
    {
      badge: Badges.LIKE_100,
      condition: group.likeCount >= 100,
    },
    {
      badge: Badges.PARTICIPATION_10,
      condition: participantCounts >= 1,
    },
    {
      badge: Badges.RECORD_100,
      condition: recordCount >= 1,
    },
  ];

  let updatedBadges = [...group.badges];
  let isUpdated = false;

  for (const { badge, condition } of badgeConditions) {
    const hasBadge = updatedBadges.includes(badge);

    if (condition && !hasBadge) {
      updatedBadges.push(badge);
      isUpdated = true;
    } else if (!condition && hasBadge) {
      updatedBadges = updatedBadges.filter((b) => b !== badge);
      isUpdated = true;
    }
  }

  if (isUpdated) {
    await prisma.group.update({
      where: { group_id: groupId },
      data: {
        badges: updatedBadges,
      },
    });
    console.log(`Badges for group ${groupId} updated.`);
  } else {
    console.log(`No badge updates needed for group ${groupId}.`);
  }
};
