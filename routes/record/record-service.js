import { PrismaClient, ExerciseType } from "@prisma/client";
import axios from "axios"

const prisma = new PrismaClient();

const transformExercise = (exercise) => ({
  id: exercise.exercise_id,
  exerciseType: exercise.exerciseType,
  description: exercise.description,
  time: exercise.time,
  distance: exercise.distance,
  photos: exercise.photos ? exercise.photos.split(',') : [],
  author: {
    id: exercise.group_user.participant_id,
    nickname: exercise.group_user.nickname,
  },
  createdAt: exercise.created_at,
  updatedAt: exercise.updated_at,
});

// 1. 운동 기록 생성
export const createRecord = async (groupId, data) => {
  const {
    authorNickname,
    authorPassword,
    exerciseType,
    description,
    time,
    distance,
    photos,
  } = data;

  const groupUser = await prisma.groupUser.findFirst({
    where: { group_id: groupId, nickname: authorNickname },
  });

  if (!groupUser) {
    throw new Error('no user');
  }
  if (groupUser.password !== authorPassword) {
    throw new Error('password mismatch');
  }

  const newRecord = await prisma.exercise.create({
    data: {
      group_id: groupId,
      group_user_id: groupUser.participant_id,
      exerciseType: exerciseType?.toUpperCase(),
      description,
      time,
      distance,
      photos: photos?.length ? photos.join(',') : null,
    },
    include: {
      group_user: { select: { participant_id: true, nickname: true } },
    },
  });

  await prisma.group.update({
    where: { group_id: groupId },
    data: { exercise_count: { increment: 1 } },
  });

  return transformExercise(newRecord);
};


// 2. 운동 기록 목록 조회
export const getRecordList = async (
  groupId, 
  { page = 1, limit = 10, orderBy, search } = {}
) => {
    const pageNum = parseInt(page, 10) >= 1 ? parseInt(page, 10) : 1;
    const limitNum = parseInt(limit, 10) ? parseInt(limit, 10) : 10;
    const skip = (pageNum - 1) * limitNum;
    const take = limitNum;

  const where = {
    group_id: groupId,
    ...(search
      ? {
          OR: [
            {
              group_user: {nickname: { contains: String(search), mode: 'insensitive' },
              },
            },
          ],
        }
      : {}),
  };

  let order;
  switch (orderBy) {
    case 'time':
      order = { time: 'desc' };
      break;
    case 'createdAt':
    default:
      order = { created_at: 'desc' };
      break;
  }

  const records = await prisma.exercise.findMany({
    where,
    orderBy: order,
    skip,
    take,
    include: { 
      group_user: { select: { participant_id: true, nickname: true } } },
      // group: true,
  });

  const total = await prisma.exercise.count({ where });
  return { data: records.map(transformExercise), total };
};

