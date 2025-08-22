import { PrismaClient } from '@prisma/client';
import { group } from 'console';
import express from 'express';
import { parse } from 'path';

const prisma = new PrismaClient();

export const getRecordList = async (
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
          { group_user: { nickname: { contains: String(search), mode: 'insensitive' } } },
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


export const createRecord = async (data) => {
  const newRecord = await prisma.exercise.create({
    data: {
      exerciseType: data.exerciseType.toUpperCase(),  // 스키마 대문자 > 소문자 변환
      description: data.description || null,
      time: data.time,
      distance: data.distance,
      photos: data.photoUrl || null,
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
  getRecordList,
  createRecord,
};
