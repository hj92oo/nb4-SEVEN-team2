import { z } from 'zod';

// 🔹 enum 매핑
export const ExerciseTypeEnum = z.enum(['run', 'bike', 'swim']);
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
  name: z.string().min(1, '그룹명은 비워둘 수 없어요.'),
  description: z.string().min(1, '설명은 비워둘 수 없어요.'),
  photoUrl: z.string().nullable().optional(),
  goalRep: z.number().int({ message: '정확한 목표 기록이 맞나요?' }),

  discordWebhookUrl: urlValidator,
  discordInviteUrl: urlValidator,

  tags: z.array(z.string()).optional(),
  ownerNickname: z.string(),
  ownerPassword: z.string().min(4, '비밀번호는 최소 4자 이상이어야 합니다.'),
});

export const createRecordSchema = z.object({
  exerciseType: ExerciseTypeEnum,
  description: z.string().min(1, '설명은 비워둘 수 없어요.'),
  time: z.number().int().nonnegative({ message: '정확한 시간이 맞나요?' }),
  distance: z.number().int().nonnegative({ message: '정확한 거리가 맞나요?' }),
  photos: z.array(z.url()).optional(),
  authorNickname: z.string().min(1, '작성자 닉네임은 필수예요.'),
  authorPassword: z.string().min(4, '비밀번호는 최소 4자 이상!'),
});
