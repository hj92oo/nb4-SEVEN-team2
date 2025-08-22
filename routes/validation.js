import { z } from "zod";

// 🔹 enum 매핑 (대문자 기준)
export const ExerciseTypeEnum = z.enum(["RUN", "BIKE", "SWIM"]);
export const BadgesEnum = z.enum(["LIKE_100", "PARTICIPATION_10", "RECORD_100"]);

const urlValidator = z.preprocess(
  (val) => (val === "" ? undefined : val),
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
      { message: "유효하지 않은 URL입니다." }
    )
    .optional()
);

export const createandupdateGroupSchema = z.object({
  name: z.string().min(1, "그룹 이름은 필수입니다."),
  description: z.string().optional(),
  photoUrl: z.string().optional(),
  goalRep: z.preprocess(
    (val) => {
      if (val === "" || val === null || typeof val === "undefined") return undefined;
      if (typeof val === "string") return Number(val);
      return val;
    },
    z.number().int().nonnegative().optional()
  ),
  discordWebhookUrl: urlValidator,
  discordInviteUrl: urlValidator,
  tags: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        try {
          const parsed = JSON.parse(val);
          return parsed;
        } catch {
          return [val];
        }
      }
      return val;
    },
    z.array(z.string()).optional()
  ),
  ownerNickname: z.string().min(1, "ownerNickname은 필수입니다."),
  ownerPassword: z.string().min(1, "ownerPassword는 필수입니다."),
});

/**
 * Exercise
 * - 소문자 입력 허용하도록 preprocessor 추가
 * - photos는 배열 입력을 문자열로 join 처리 가능하게
 */
export const createExerciseSchema = z.object({
  exerciseType: z
    .string()
    .transform(val => val.toUpperCase())
    .refine(val => ["RUN","BIKE","SWIM"].includes(val), {
      message: 'Invalid option: expected one of "RUN"|"BIKE"|"SWIM"',
    }),
  description: z.string().max(255).optional(),
  time: z.number().int().nonnegative().optional(),
  distance: z.number().int().nonnegative().optional(),
  photos: z.preprocess(val => {
    if (Array.isArray(val)) return val.join(',');
    return val;
  }, z.string().url().optional()),

  // 프론트에서 보내는 user 정보
  authorNickname: z.string().min(1, "닉네임 필수"),
  authorPassword: z.string().min(1, "비밀번호 필수"),
});



export const updateExerciseSchema = createExerciseSchema.partial();
