import { PrismaClient, ExerciseType } from '@prisma/client';
import axios from 'axios';
import { group } from 'console';
import { parse } from 'path';

const prisma = new PrismaClient();

export const getExerciseList = async (
  groupId,
  { page = 1,
    limit = 6,
    orderBy,
    search } = {
    }) => {
      const pageNum = parseInt(page, 10) >= 1 ? parseInt(page, 10) : 1;
      const limitNum = parseInt(limit, 10) ? parseInt(limit, 10) : 6;
      const offset = parseInt(pageNum - 1, 10) * limitNum;

  let order;
  switch (orderBy) {
    case 'time':
      order = { time: 'desc' };
      break;
    case 'createdAt':
    default:
      order = { created_at: 'desc' };
  }
  const where = {
    group_id: groupId,
    ...(search
      ? {
        OR: [
          { group_user: { nickname: { contains: String(search), mode: 'insensitive' 
                          //        { equals: String(search), mode: 'insensitive') 닉네임 전체 검색 vs 닉네임 일부 검색
          } } },
        ],
      }
      : {}),
  };
   const records = await prisma.exercise.findMany({
    where,
    orderBy: order,
    skip: offset,
    take: limitNum,
    include: {
      group_user: true,
      group: true,
    },
  });
  const total = await prisma.exercise.count({
    where: { group_id: groupId },
  });
  const response = records.map(transformExercise);
  return { data: response, total: total };
};


export const createExercise = async (data) => {
  const newRecord = await prisma.exercise.create({
    data: {
      exerciseType: data.exerciseType.toUpperCase(),  // 스키마 대문자 > 소문자 변환
      description: data.description || null,
      time: data.time,
      distance: data.distance,
      photos: data.photoUrl ? { push: data.photoUrl } : null,
      group_user: {
        connect: {
          group_id_nickname: {
            nickname: data.authorNickname,
            group_id: data.groupId,
          },
        },
      },
      group: {
        connect: {
          group_id: data.groupId,
        },
      },
    }
  });

  return newRecord;
};



//웹훅 포함 구현

// const createExercise = async (groupId, data) => {
//   const {
//     exerciseType,
//     description,
//     time,
//     distance,
//     authorNickname,
//     authorPassword,
//   } = data;

//   const groupUser = await prisma.groupUser.findFirst({
//     where: {
//       group_id: groupId,
//       nickname: authorNickname,
//       password: authorPassword,
//     },
//   });

//   const [newExercise, updatedGroup] = await prisma.$transaction([
//     prisma.exercise.create({
//       data: {
//         exerciseType: ExerciseType[exerciseType.toUpperCase()],
//         description,
//         time,
//         distance,
//         photos: data.photos?.[0] ?? null,
//         group_id: groupId,
//         group_user_id: groupUser.participant_id,
//       },
//       include: {
//         group_user: {
//           select: {
//             participant_id: true,
//             nickname: true,
//           },
//         },
//       },
//     }),

//     prisma.group.update({
//       where: {
//         group_id: groupId,
//       },
//       data: {
//         exercise_count: {
//           increment: 1,
//         },
//       },
//       select: {
//         discord_webhook_url: true,
//       },
//     }),
//   ]);

//   if (updatedGroup && updatedGroup.discord_webhook_url) {
//     await sendDiscordwebhook(updatedGroup.discord_webhook_url, newExercise);
//   }

//   const response = transformExercise(newExercise);
//   return response;
// };

// export async function sendDiscordwebhook(webhookUrl, newExercise) {
//   const exerciseTypeLabels = {
//     RUN: '러닝',
//     BIKE: '사이클링',
//     SWIM: '수영',
//   };

//   const exerciseTypeColors = {
//     RUN: 0xff0000, // 빨강
//     BIKE: 0x00ff00, // 초록
//     SWIM: 0x0000ff, // 파랑
//   };

//   const totalSeconds = newExercise.time;
//   const minutes = Math.floor(totalSeconds / 60);
//   const seconds = totalSeconds % 60;

//   if (!webhookUrl) {
//     return;
//   }

//   try {
//     const message = {
//       content: `새로운 운동 기록이 등록되었습니다!`,
//       embeds: [
//         {
//           title: `${newExercise.group_user.nickname}님의 새로운 기록`,
//           color: exerciseTypeColors[newExercise.exerciseType] || 0xffffff,
//           fields: [
//             {
//               name: '운동 종류',
//               value:
//                 exerciseTypeLabels[newExercise.exerciseType] ||
//                 newExercise.exerciseType,
//               inline: true,
//             },
//             {
//               name: '시간',
//               value: `${minutes}분 ${seconds}초`,
//               inline: true,
//             },
//             {
//               name: '거리',
//               value: `${newExercise.distance}km`,
//               inline: true,
//             },
//           ],
//         },
//       ],
//     };

//     await axios.post(webhookUrl, message);
//     console.log('디스코드 알림이 성공적으로 전송되었습니다.');
//   } catch (error) {
//     console.error('디스코드 알림 전송 실패:', error.message);
//   }
// }

const transformExercise = (exercise) => {
  return {
    id: exercise.exercise_id,
    exerciseType: exercise.exerciseType,
    description: exercise.description,
    time: exercise.time,
    distance: exercise.distance,
    photos: exercise.photos ? [exercise.photos] : [],
    author: {
      id: exercise.group_user.participant_id,
      nickname: exercise.group_user.nickname,
    },
    createdAt: exercise.created_at,
    updatedAt: exercise.updated_at,
  };
};

export default {
  createExercise,
  getExerciseList,
};
