import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();



export const getGroupList = async (
  offset = 0,
  limit = 3,
  orderBy,
  search
) => {
  let order;
  switch (orderBy) {
    case 'likeCount':
      order = { likeCount: 'desc' };
      break;
    case 'participantCount':
      order = { participants: { _count: 'desc' } };
      break;
    case 'createdAt':
    default:
      order = { createdAt: 'desc' };
  }

  const where = search
    ? {
        OR: [{ group_name: { contains: String(search), mode: 'insensitive' } }],
      }
    : {};

  const groups = await prisma.group.findMany({
    where,
    orderBy : order,
    skip: Number(offset),
    take: Number(limit),
    include: {
      participants: true,
    },
  });

  const response = groups.map(transformGroup);

  return response;
};

export default {
  getGroupList,
};
