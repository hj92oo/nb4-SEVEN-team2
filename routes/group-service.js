import { PrismaClient, Badges } from '@prisma/client';

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
  orderBy,
  search
) => {
  let order;
  switch (orderBy) {
    case 'likeCount':
      order = { likeCount: 'desc' };
      break;
    /* case 'participantCount':
      order = { participantCount: 'desc' };
      break; */
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

const updateGroup = async (groupId, data) => {
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

const deleteGroup = async (groupId) => {
  await prisma.group.delete({
    where: { group_id : groupId },
  });
};

const likeGroup = async (groupId) => {
  const incremented = await prisma.group.update({
    where: { group_id : groupId },
    data: { likeCount: { increment: 1 } },
  });
  return incremented;
};

const unlikeGroup = async (groupId) => {
  const decremented = await prisma.group.update({
    where: { group_id: groupId },
    data: { likeCount: { decrement: 1 } },
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
}

const deleteUser = async(groupId , dto) => {
  const participationId = await prisma.groupUser.findFirst({
    where : { group_id : groupId , nickname : dto.nickname },
    select : {  participant_id : true }
  })

  const deleteUser = await prisma.groupUser.delete({
    where : { participationId } 
  })
}

// TeamA add the badges 
const checkAndAwardBadges = async (groupId) => {
  const group = await prisma.group.findUnique({
    where: { group_id: groupId },
  });
  // 추천
  if (group.likeCount >= 100 && !group.badges.includes(Badges.LIKE_100)) {
    await prisma.group.update({
      where: { group_id: groupId },
      data: {
        badges: {
          push: Badges.LIKE_100,
        },
      },
    })
  } 
  else if (group.likeCount < 100 && group.badges.includes(Badges.LIKE_100)) {
    await prisma.group.update({
      where: { group_id: groupId },
      data: {
        badges: {
          // 뱃지 제거
          set: group.badges.filter((badge) => badge !== Badges.LIKE_100),
        },
      },
    });
  } 

  // // 참여자
  // const participantCount = await prisma.groupUser.count({
  //   where: { group_id: groupId },
  // })
  // if ( participantCount >= 10 && !group.badges.includes(Badges.PARTICIPATION_10)){
  //   await prisma.group.update({
  //     where: { group_id: groupId },
  //     data: {
  //       badges: {
  //         push: Badges.PARTICIPATION_10,
  //       },
  //     },
  //   });
  // }
  // // 운동 기록
  // const recordCount = await prisma.group.count({
  //   where: { group_id: groupId },
  // })
  // if ( recordCount >= 1 && !group.badges.includes(Badges.RECORD_100)){
  //   await prisma.group.update({
  //     where: { group_id: groupId },
  //     data: {
  //       badges: {
  //         push: Badges.RECORD_100,
  //       },
  //     },
  //   });
  // }
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
  GroupParticipation,
  checkAndAwardBadges,
  deleteUser,
};