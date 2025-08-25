import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const GroupParticipation = async (data, group_id) => {
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
      id: group.nickname,
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