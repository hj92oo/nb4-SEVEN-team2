import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const checkGroupPassword = async (req, res, next) => {
  const group_id = parseInt(req.params.groupId);
  const { ownerPassword } = req.body;
  if (!ownerPassword) {
    return res.status(400).json({
      error: {
        path: 'ownerPassword',
        message: '비밀번호를 입력해 주세요.',
      },
    });
  }

  try {
    const targetGroup = await prisma.group.findUnique({
      where: { group_id : group_id , password : ownerPassword },
    });
    if (targetGroup.password !== ownerPassword) {
      return res.status(401).json({
        error: {
          path: 'ownerPassword',
          message: '비밀번호가 일치하지 않습니다.',
        },
      });
    }
    req.group = targetGroup;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: { message: 'Database error.' } });
  }
};

// auth.js << 비밀번호 등 검사해야하는거를 여기에 넣으면 좋겠다
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
      return res.status(401).json({ message: '등록된 사용자가 아닙니다.' });
    }
    if (groupUser.password !== pwd) {
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
    }
    console.log(groupUser);
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};