import { z } from 'zod';

// 🔹 enum 매핑
const ExerciseTypeEnum = ['run', 'bike', 'swim'];
const OrderByEnum = z.enum([
  'likeCount',
  'participantCount',
  'createdAt',
  'time',
]);
const DurationEnum = z.enum(['monthly', 'weekly']);

// 그룹 등록
const createandupdateGroupSchema = z.object({
  name: z.string().min(1, '그룹명은 비워둘 수 없어요.'),
  description: z.string().min(1, '설명은 비워둘 수 없어요.'),
  photoUrl: z.string().nullable().optional(),
  goalRep: z.number().refine((val) => Number.isInteger(val) && val >= 0, {
    message: '목표 횟수가 잘못됐어요!',
  }),
  discordWebhookUrl: z.url('유효하지 않은 URL일걸요?'),
  discordInviteUrl: z.url('유효하지 않은 URL일걸요?'),
  tags: z.array(z.string()).optional(),
  ownerNickname: z.string().trim().min(1, '닉네임 입력은 필수예요!'),
  ownerPassword: z
    .string()
    .trim()
    .min(4, '비밀번호는 최소 4자 이상이어야 합니다.'),
});

// 기록 등록
const createRecordSchema = z.object({
  exerciseType: z.string().refine((val) => ExerciseTypeEnum.includes(val), {
    message: '운동 종류가 올바르지 않아요!',
  }),
  description: z.string().min(1, '설명은 비워둘 수 없어요.'),
  time: z.number().superRefine((val, ctx) => {
    if (!Number.isInteger(val) || val < 0) {
      ctx.addIssue({
        code: 'custom',
        message: '정말 이 시간이 맞나요?',
      });
    }
  }),
  distance: z.number().superRefine((val, ctx) => {
    if (!Number.isInteger(val) || val < 0) {
      ctx.addIssue({
        code: 'custom',
        message: '정확한 거리가 맞나요?',
      });
    }
  }),
  photos: z
    .array(z.url())
    .max(3, '사진은 최대 3장까지 등록 가능해요.')
    .optional(),
  authorNickname: z.string().min(1, '작성자 닉네임은 필수예요.'),
  authorPassword: z.string().min(4, '비밀번호는 최소 4자 이상!'),
});

// 그룹 참여, 탈퇴(닉네임, 패스워드)
const groupNickAndPwdSchema = z.object({
  nickname: z.string().trim().min(1, '닉네임 입력은 필수예요!'),
  password: z.string().trim().min(4, '비밀번호는 최소 4자 이상!'),
});

// 목록 조회(페이지, 리밋, 오더바이, 서치) // req.query
const checkPaginationSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  orderBy: OrderByEnum.optional(),
  search: z.string().trim().optional(),
});

// id 검사(그룹 상세 조회, 그룹 삭제) // req.params
const checkGroupIdSchema = z.object({
  groupId: z.coerce.number().int(),
});

const checkDurationSchena = z.object({
  duration: DurationEnum,
});

export default {
  createandupdateGroupSchema,
  createRecordSchema,
  groupNickAndPwdSchema,
  checkPaginationSchema,
  checkGroupIdSchema,
  checkDurationSchena,
};
