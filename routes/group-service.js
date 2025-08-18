import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createGroup = async (data) => {
  const newGroup = await prisma.group.create({ data });
  return newGroup;
};

export const getGroupList = async (
  offset = 0,
  limit = 3,
  order = 'newest',
  search
) => {
  let orderBy;
  switch (order) {
    case 'oldest':
      orderBy = { createdAt: 'asc' };
      break;
    case 'newest':
    default:
      orderBy = { createdAt: 'desc' };
  }

  const where = search
    ? {
        OR: [{ name: { contains: String(search), mode: 'insensitive' } }],
      }
    : {};

  const groups = await prisma.group.findMany({
    where,
    orderBy,
    skip: Number(offset),
    take: Number(limit),
  });

  return groups;
};

export const getGroupById = async (groupId) => {
  const group = await prisma.group.findUniqueOrThrow({
    where: { id: groupId },
    select: {
      name: true,
      description: true,
      nickname: true,
      photoUrl: true,
      tags: true,
      discordInviteUrl: true,
    },
  });

  return group;
};

export const updateGroup = async (groupId, data) => {
  const updatedGroup = await prisma.group.update({
    where: { id: groupId },
    data,
  });
  return updatedGroup;
};

export const deleteGroup = async (groupId) => {
  await prisma.group.delete({
    where: { id: groupId },
  });
};

export const likeGroup = async (groupId) => {
  const addLike = await prisma.group.update({
    where: { id: groupId },
    data: { likeCount: { increment: 1 } },
  });
  return addLike;
};

export const unlikeGroup = async (groupId) => {
  const decremented = await prisma.group.update({
    where: { id: groupId },
    data: { likeCount: { decrement: 1 } },
  });
  return decremented;
};

export default {
  createGroup,
  updateGroup,
  deleteGroup,
  likeGroup,
  unlikeGroup,
  getGroupList,
  getGroupById,
};
