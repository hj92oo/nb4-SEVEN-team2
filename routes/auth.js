import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const checkGroupPassword = async (req, res, next) => {
  const group_id = parseInt(req.params.groupId);
  const { ownerPassword } = req.body;
  try {
    const targetGroup = await prisma.group.findFirst({
      where: { group_id: group_id },
    });
    if (!targetGroup) {
      return res.status(404).json({
        message: '그룹을 찾을 수 없어요.',
      });
    }
    if (targetGroup.password !== ownerPassword) {
      return res.status(401).json({
        path: 'ownerPassword',
        message: '비밀번호가 일치하지 않아요!!!',
      });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: { message: 'Database error.' } });
  }
};

export const checkGroupUser = async (req, res, next) => {
  const { groupId } = req.params;
  const { authorNickname, authorPassword, nickname, password } = req.body;
  const pwd = password ?? authorPassword;
  const nick = nickname ?? authorNickname;

  try {
    const groupUser = await prisma.groupUser.findFirst({
      where: {
        group_id: parseInt(groupId),
        nickname: nick,
      },
    });
    if (!groupUser) {
      return res.status(404).json({ message: '등록된 사용자가 아닙니다.' });
    }
    if (groupUser.password !== pwd) {
      return res
        .status(401)
        .json({ message: '비밀번호가 일치하지 않을지도요?' });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

export const checkNicknameDuplicate = async (req, res, next) => {
  const { groupId } = req.params;
  const { nickname } = req.body;

  const existing = await prisma.groupUser.findFirst({
    where: { group_id: parseInt(groupId), nickname },
  });

  if (existing) {
    return res
      .status(409)
      .json({ message: '이미 사용하고 있는 닉네임이에요!' });
  }
};
