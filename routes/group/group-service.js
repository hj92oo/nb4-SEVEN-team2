import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createGroup = async (data) => {
  const newGroup = await prisma.group.create({
    data: {
      group_name: data.name,
      nickname: data.ownerNickname,
      password: data.ownerPassword,
      description: data.description || null,
      image_url: data.photoUrl || null,
      goalRep: data.goalRep,
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

const getGroupList = async (page = 1, limit = 10, orderBy, search) => {
  const safePage = Math.max(1, parseInt(page, 10) || 1);
  const take = Math.max(1, parseInt(limit, 10) || 10);
  const skip = (safePage - 1) * take;

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
    orderBy: order,
    skip,
    take,
    include: {
      participants: true,
    },
  });

  const response = groups.map(transformGroup);
  const total = await prisma.group.count({ where });

  return { data: response, total };
};

const getGroupById = async (groupId) => {
  const group = await prisma.group.findUniqueOrThrow({
    where: { group_id: groupId },
    include: {
      participants: true,
    },
  });
  const response = transformGroup(group);
  return response;
};

const updateGroup = async (groupId, data) => {
  const updatedGroup = await prisma.group.update({
    where: { group_id: groupId },
    data: {
      group_name: data.group_name,
      nickname: data.ownerNickname,
      password: data.ownerPassword,
      description: data.description || null,
      image_url: data.photoUrl || null,
      goalRep: data.goalRep,
      discord_webhook_url: data.discordWebhookUrl || null,
      discord_invite_url: data.discordInviteUrl || null,
      tags: data.tags || [],
    },
  });
  return updatedGroup;
};

const deleteGroup = async (groupId) => {
  await prisma.group.delete({
    where: { group_id: groupId },
  });
};

const likeGroup = async (groupId) => {
  const incremented = await prisma.group.update({
    where: { group_id: groupId },
    data: { likeCount: { increment: 1 } },
  });
  return incremented;
};

// const unlikeGroup = async (groupId) => {
//   const decremented = await prisma.group.update({
//     where: { group_id: groupId },
//     data: { likeCount: { decrement: 1 } },
//   });
//   return decremented;
// };

const unlikeGroup = async (groupId) => {
  const decremented = await prisma.$transaction(async (tx) => {
    const group = await tx.group.findUnique({
      where: { group_id: groupId },
      select: { likeCount: true },
    });

    if (group && group.likeCount > 0) {
      return await tx.group.update({
        where: { group_id: groupId },
        data: { likeCount: { decrement: 1 } },
      });
    }

    return group;
  });

  return decremented;
};

const GroupParticipation = async (data, group_id) => {
  const participation = await prisma.groupUser.create({
    data: {
      group_id: group_id,
      nickname: data.nickname,
      password: data.password,
    },
  });

  const group = await prisma.group.findUniqueOrThrow({
    where: { group_id: group_id },
    include: {
      participants: true,
    },
  });

  const response = transformGroup(group);
  return response;
};

export const deleteUser = async (groupId, nickname) => {
  await prisma.$transaction(async (tx) => {
    const participantUser = await tx.groupUser.findFirst({
      where: {
        group_id: groupId,
        nickname,
      },
      select: {
        participant_id: true,
      },
    });
    const recordCount = await tx.exercise.count({
      where: {
        group_user_id: participantUser.participant_id,
      },
    });

    await tx.groupUser.delete({
      where: {
        participant_id: participantUser.participant_id,
      },
    });

    if (recordCount > 0) {
      await tx.group.update({
        where: { group_id: groupId },
        data: {
          exercise_count: {
            decrement: recordCount,
          },
        },
      });
    }
  });
};

function transformGroup(group) {
  return {
    id: group.group_id,
    name: group.group_name,
    description: group.description,
    photoUrl: group.image_url,
    goalRep: group.goalRep,
    discordWebhookUrl: group.discord_webhook_url,
    discordInviteUrl: group.discord_invite_url,
    owner: {
      nickname: group.nickname,
      id: group.participant_id,
      createdAt: group.createdAt,
      updatedAt: group.updatedAt,
    },
    likeCount: group.likeCount,
    tags: group.tags,
    participants: group.participants ?? [],
    badges: group.badges,
    createdAt: group.createdAt,
    updatedAt: group.updatedAt,
    recordCount: group.exercise_count,
  };
}

export default {
  createGroup,
  updateGroup,
  deleteGroup,
  likeGroup,
  unlikeGroup,
  getGroupList,
  getGroupById,
  GroupParticipation,
  deleteUser,
};
