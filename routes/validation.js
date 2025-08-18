import { z } from 'zod';

const groupSchema = z.object({
  name: z.string().min(1, { message: '그룹명을 입력해 주세요.' }),
  description: z.string().min(1, { message: '설명을 입력해 주세요.' }),
  photoUrl: z.string().optional(),
  goalRep: z.number().min(1, { message: 'goalRep 필드는 필수입니다.' }),
  discordWebhookUrl: z.url({
    message: '올바른 디스코드 웹훅 URL 형식을 입력해 주세요.',
  }),
  discordInviteUrl: z.url({
    message: '올바른 디스코드 초대 URL 형식을 입력해 주세요.',
  }),
  tags: z.array(z.string()).optional(),
  ownerNickname: z.string().min(1, { message: '닉네임을 입력해 주세요.' }),
  ownerPassword: z.string().min(1, { message: '패스워드를 입력해 주세요.' }),
});

export const validateGroup = (req, res, next) => {
  const result = groupSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.errors });
  }
  next();
};
