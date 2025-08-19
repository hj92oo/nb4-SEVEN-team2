import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

export const createGroup = async (data) => {
  const newGroup = await prisma.group.create({
        data: {
          group_name: data.name,
          nickname: data.ownerNickname,
          password: data.ownerPassword,
          description: data.description || null,
          image_url: data.photoUrl || null,
          goalRep: data.goalRep,
          target_count: data.targetCount || null,
          discord_webhook_url: data.discordWebhookUrl || null,
          discord_invite_url: data.discordInviteUrl || null,
          tags: data.tags || [],
        },
        include: {
          participants: true,
        },
      });
      const response = transformGroup(newGroup);

  return response;
};

export const getGroupList = async (
  offset = 0,
  limit = 3,
  order = 'createdAt',
  search
) => {
  let orderBy;
  switch (order) {
    case 'likeCount':
      orderBy = { likeCount: 'desc' };
      break;
    case 'participantCount':
      orderBy = { participantCount: 'desc' };
      break;
    case 'createdAt':
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
    include: {
      participants: true,
    },
  });

  const response = groups.map(transformGroup);
  
  return response;
};

export const getGroupById = async (groupId) => {
  const group = await prisma.group.findUniqueOrThrow({
    where: { group_id: groupId },
    include: {
      participants: true,
    },
  });
  const response = transformGroup(group);
  return response;
};

export const updateGroup = async (groupId, data) => {
  const updatedGroup = await prisma.group.update({
    where: { group_id : groupId },
    data: {
          group_name: data.name,
          nickname: data.ownerNickname,
          password: data.ownerPassword,
          description: data.description || null,
          image_url: data.photoUrl || null,
          goalRep: data.goalRep,
          target_count: data.targetCount || null,
          discord_webhook_url: data.discordWebhookUrl || null,
          discord_invite_url: data.discordInviteUrl || null,
          tags: data.tags || [],
        },
  });
  return updatedGroup;
};

export const deleteGroup = async (groupId) => {
  await prisma.group.delete({
    where: { group_id : groupId },
  });
};

export const likeGroup = async (groupId) => {
  const incremented = await prisma.group.update({
    where: { group_id : groupId },
    data: { likeCount: { increment: 1 } },
  });
  return incremented;
};

export const unlikeGroup = async (groupId) => {
  const decremented = await prisma.group.update({
    where: { id: groupId },
    data: { likeCount: { decrement: 1 } },
  });
  return decremented;
};

function transformGroup(group) {
  return {
    id : group.group_id,
    name: group.group_name,
    description: group.description,
    photoUrl: group.image_url,
    goalRep: group.goalRep,
    discordWebhookUrl: group.discord_webhook_url,
    discordInviteUrl: group.discord_invite_url,
    owner : {
      nickname : group.nickname,
      id : group.nickname,
      createdAt : group.createdAt,
      updatedAt : group.updatedAt,
    },
    likeCount : group.likeCount,
    tags : group.tags,
    participants: group.participants ?? [],
    badges : group.badges,
    recordCount :  group.recommendation_count,
    createdAt : group.createdAt,
    updatedAt : group.updatedAt
  }
}

export default {
  createGroup,
  updateGroup,
  deleteGroup,
  likeGroup,
  unlikeGroup,
  getGroupList,
  getGroupById,
};