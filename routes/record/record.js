import express from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { checkGroupUser } from '../auth.js';
import { validateZod } from '../../middlewares/validateZod.js';

const prisma = new PrismaClient();

// ======= Validation =======
export const createExerciseSchema = z.object({
  exerciseType: z
    .string()
    .transform(val => val.toUpperCase())
    .refine(val => ['RUN', 'BIKE', 'SWIM'].includes(val), {
      message: 'Invalid option: expected one of "RUN"|"BIKE"|"SWIM"',
    }),
  description: z.string().max(255).optional(),
  time: z.number().int().nonnegative().optional(),
  distance: z.number().int().nonnegative().optional(),
  photos: z.array(z.string().url()).optional(),
  authorNickname: z.string(),
  authorPassword: z.string(),
});

// ======= Transform =======
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

// ======= Service =======
export const createRecord = async (groupId, data) => {
  const { authorNickname, authorPassword, exerciseType, description, time, distance, photos } = data;

  const groupUser = await prisma.groupUser.findFirst({
    where: { group_id: groupId, nickname: authorNickname },
  });

  if (!groupUser) throw new Error('no user');
  if (groupUser.password.trim() !== authorPassword.trim()) throw new Error('password mismatch');

  const newRecord = await prisma.exercise.create({
    data: {
      group_id: groupId,
      group_user_id: groupUser.participant_id,
      exerciseType: exerciseType.toUpperCase(),
      description,
      time,
      distance,
      photos: photos ? photos.join(',') : null,
    },
    include: { group_user: { select: { participant_id: true, nickname: true } } },
  });

  await prisma.group.update({
    where: { group_id: groupId },
    data: { exercise_count: { increment: 1 } },
  });

  return transformExercise(newRecord);
};

export const getRecordList = async (groupId, { page = 1, limit = 10, orderBy, search } = {}) => {
  const skip = (page - 1) * limit;
  const take = limit;

  const where = {
    group_id: groupId,
    ...(search ? { group_user: { nickname: { equals: search, mode: 'insensitive' } } } : {}),
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
    include: { group_user: { select: { participant_id: true, nickname: true } } },
  });

  const total = await prisma.exercise.count({ where });
  return { data: records.map(transformExercise), total };
};

// ======= Controller =======
export const recordExercise = async (req, res) => {
  const groupId = parseInt(req.params.groupId);

  try {
    const newRecord = await createRecord(groupId, req.body);
    res.status(201).json(newRecord);
  } catch (err) {
    res
      .status(err.message === 'no user' ? 404 : err.message === 'password mismatch' ? 401 : 500)
      .json({ message: err.message });
  }
};

export const listRecords = async (req, res) => {
  const groupId = parseInt(req.params.groupId);
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const orderBy = req.query.orderBy;
  const search = req.query.search;

  try {
    const records = await getRecordList(groupId, { page, limit, orderBy, search });
    res.status(200).json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '운동 기록 조회 실패' });
  }
};

// ======= Router =======
const router = express.Router();

router
  .route('/:groupId/records')
  .post(checkGroupUser, validateZod(createExerciseSchema), recordExercise)
  .get(listRecords);

export default router;
