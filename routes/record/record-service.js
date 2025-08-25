import { PrismaClient, ExerciseType } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

const createExercise = async (groupId, data) => {
  const {
    exerciseType,
    description,
    time,
    distance,
    authorNickname,
    authorPassword,
  } = data;

  const groupUser = await prisma.groupUser.findFirst({
    where: {
      group_id: groupId,
      nickname: authorNickname,
      password: authorPassword,
    },
  });

  const [newExercise, updatedGroup] = await prisma.$transaction([
    prisma.exercise.create({
      data: {
        exerciseType: ExerciseType[exerciseType.toUpperCase()],
        description,
        time,
        distance,
        photos: data.photos ?? [],
        group_id: groupId,
        group_user_id: groupUser.participant_id,
      },
      include: {
        group_user: {
          select: {
            participant_id: true,
            nickname: true,
          },
        },
      },
    }),

    prisma.group.update({
      where: {
        group_id: groupId,
      },
      data: {
        exercise_count: {
          increment: 1,
        },
      },
      select: {
        discord_webhook_url: true,
      },
    }),
  ]);

  if (updatedGroup && updatedGroup.discord_webhook_url) {
    await sendDiscordwebhook(updatedGroup.discord_webhook_url, newExercise);
  }

  const response = transformExercise(newExercise);
  return response;
};

export async function sendDiscordwebhook(webhookUrl, newExercise) {
  const exerciseTypeLabels = {
    RUN: '러닝',
    BIKE: '사이클링',
    SWIM: '수영',
  };

  const exerciseTypeColors = {
    RUN: 0xff0000, // 빨강
    BIKE: 0x00ff00, // 초록
    SWIM: 0x0000ff, // 파랑
  };

  const totalSeconds = newExercise.time;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (!webhookUrl) {
    return;
  }

  try {
    const message = {
      content: `새로운 운동 기록이 등록되었습니다!`,
      embeds: [
        {
          title: `${newExercise.group_user.nickname}님의 새로운 기록`,
          color: exerciseTypeColors[newExercise.exerciseType] || 0xffffff,
          fields: [
            {
              name: '운동 종류',
              value:
                exerciseTypeLabels[newExercise.exerciseType] ||
                newExercise.exerciseType,
              inline: true,
            },
            {
              name: '시간',
              value: `${minutes}분 ${seconds}초`,
              inline: true,
            },
            {
              name: '거리',
              value: `${newExercise.distance}km`,
              inline: true,
            },
          ],
        },
      ],
    };

    await axios.post(webhookUrl, message);
    console.log('디스코드 알림이 성공적으로 전송되었습니다.');
  } catch (error) {
    console.error('디스코드 알림 전송 실패:', error.message);
  }
}

const getExerciseList = async (
  groupId,
  { page = 1, limit = 10, orderBy, search } = {}
) => {
  const safePage = Math.max(1, parseInt(page, 10) || 1);
  const take = Math.max(1, parseInt(limit, 10) || 10);
  const skip = (safePage - 1) * take;

  const where = search
    ? {
        group_id: groupId,
        group_user: {
          nickname: {
            equals: String(search),
            mode: 'insensitive',
          },
        },
      }
    : { group_id: groupId };

  let order = {};

  switch (orderBy) {
    case 'time':
      order = { time: 'desc' };
      break;
    case 'createdAt':
    default:
      order = { created_at: 'desc' };
      break;
  }

  const exercises = await prisma.exercise.findMany({
    where,
    orderBy: order,
    skip,
    take,
    include: {
      group_user: {
        select: {
          participant_id: true,
          nickname: true,
        },
      },
    },
  });

  const transformedExercises = exercises.map(transformExercise);
  const total = await prisma.exercise.count({ where });

  return {
    data: transformedExercises,
    total: total,
  };
};

const transformExercise = (exercise) => {
  return {
    id: exercise.exercise_id,
    exerciseType: exercise.exerciseType,
    description: exercise.description,
    time: exercise.time,
    distance: exercise.distance,
    photos: exercise.photos || [],
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
