import { z } from 'zod';

// 🔹 enum 매핑
// export const ExerciseTypeEnum = z.enum(['RUN', 'BIKE', 'SWIM']);
// export const BadgesEnum = z.enum([
//   'LIKE_100',
//   'PARTICIPATION_10',
//   'RECORD_100',
// ]);

const urlValidator = z.preprocess(
  (val) => (val === '' ? undefined : val),
  z
    .string()
    .refine(
      (v) => {
        try {
          new URL(v);
          return true;
        } catch {
          return false;
        }
      },
      {
        message: '유효하지 않은 URL일걸요?',
      }
    )
    .optional()
);

export const createandupdateGroupSchema = z.object({
  name: z.string(),
  description: z.string(),

  photoUrl: z.string().optional(),

  goalRep: z.number().int(),

  discordWebhookUrl: urlValidator,
  discordInviteUrl: urlValidator,

  tags: z.array(z.string()).optional(),

  ownerNickname: z.string(),
  ownerPassword: z.string().min(4, '비밀번호는 최소 4자 이상이어야 합니다.'),
});
