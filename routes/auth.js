import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const checkGroupPassword = async (req, res, next) => {
  const group_id = parseInt(req.params.groupId, 10);
  const { ownerPassword } = req.body;
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
};

const checkGroupUser = async (req, res, next) => {
  const { groupId } = req.params;
  const { authorNickname, authorPassword, nickname, password } = req.body;
  const pwd = password ?? authorPassword;
  const nick = nickname ?? authorNickname;

  const groupUser = await prisma.groupUser.findFirst({
    where: {
      group_id: parseInt(groupId, 10),
      nickname: nick,
    },
  });
  if (!groupUser) {
    return res.status(404).json({ message: '등록된 사용자가 아니에요.' });
  }
  if (groupUser.password !== pwd) {
    return res.status(401).json({ message: '비밀번호가 일치하지 않을지도요?' });
  }

  next();
};

const checkNicknameDuplicate = async (req, res, next) => {
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

  next();
};

export default {
  checkGroupPassword,
  checkGroupUser,
  checkNicknameDuplicate,
};
