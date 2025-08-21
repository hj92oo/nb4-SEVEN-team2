import { PrismaClient, ExerciseType } from '@prisma/client';

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

  const newExercise = await prisma.exercise.create({
    data: {
      exerciseType: ExerciseType[exerciseType.toUpperCase()],
      description,
      time,
      distance,
      photos: data.photos?.[0] ?? null,
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
  });

  const response = transformExercise(newExercise);
  return response;
};

const getExercises = async (groupId, { page, limit, orderBy, search } = {}) => {
  const take = parseInt(limit, 10) || 10;
  const skip = ((parseInt(page, 10) || 1) - 1) * take;

  const where = search
    ? {
        group_id: groupId,
        description: { contains: String(search), mode: 'insensitive' },
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
    where: where,
    orderBy: order,
    skip: skip,
    take: take,
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
  const total = await prisma.exercise.count({ where: { group_id: groupId } });

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
  getExercises,
};
