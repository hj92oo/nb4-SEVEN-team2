import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const checkGroupPassword = async (req, res, next) => {
  const group_id = parseInt(req.params.groupId);
  const { ownerPassword } = req.body;
  // if (!ownerPassword) {
  //   return res.status(400).json({
  //     path: 'ownerPassword',
  //     message: '비밀번호를 입력해 주세요!',
  //   });
  // }
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
  const { authorNickname, authorPassword } = req.body;

  try {
    const groupUser = await prisma.groupUser.findFirst({
      where: {
        group_id: parseInt(groupId),
        nickname: authorNickname,
      },
    });
    if (!groupUser) {
      return res.status(401).json({ message: '등록된 사용자가 아니에요.' });
    }
    if (groupUser.password !== authorPassword) {
      return res.status(401).json({ message: '비밀번호가 일치하지 않네요.' });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};
