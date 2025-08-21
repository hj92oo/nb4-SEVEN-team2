import { z } from 'zod';

// 🔹 enum 매핑
export const ExerciseTypeEnum = z.enum(['RUN', 'BIKE', 'SWIM']);
export const BadgesEnum = z.enum([
  'LIKE_100',
  'PARTICIPATION_10',
  'RECORD_100',
]);

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
  name: z.string().min(1, '그룹 이름은 필수입니다.'),
  description: z.string().optional(),

  photoUrl: z.string().nullable().optional(),

  goalRep: z.preprocess((val) => {
    if (val === '' || val === null || typeof val === 'undefined')
      return undefined;
    if (typeof val === 'string') return Number(val);
    return val;
  }, z.number().int().nonnegative().optional()),

  discordWebhookUrl: urlValidator,
  discordInviteUrl: urlValidator,

  tags: z.preprocess((val) => {
    if (typeof val === 'string') {
      try {
        const parsed = JSON.parse(val);
        return parsed;
      } catch {
        return [val];
      }
    }
    return val;
  }, z.array(z.string()).optional()),

  ownerNickname: z.string().min(1, 'ownerNickname은 필수입니다.'),
  ownerPassword: z.string().min(1, 'ownerPassword는 필수입니다.'),
});

/**
 * Exercise
 */
export const createExerciseSchema = z.object({
  group_user_id: z.number().int(),
  group_id: z.number().int(),
  exerciseType: ExerciseTypeEnum,
  description: z.string().max(255).optional(),
  time: z.number().int().nonnegative().optional(),
  distance: z.number().int().nonnegative().optional(),
  photos: z.string().url().optional(),
});

export const updateExerciseSchema = createExerciseSchema.partial();
