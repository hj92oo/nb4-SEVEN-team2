-- CreateEnum
CREATE TYPE "public"."ExerciseType" AS ENUM ('RUN', 'BIKE', 'SWIM');

-- CreateEnum
CREATE TYPE "public"."Badges" AS ENUM ('LIKE_100', 'PARTICIPATION_10', 'RECORD_100');

-- CreateTable
CREATE TABLE "public"."Group" (
    "group_id" SERIAL NOT NULL,
    "group_name" TEXT NOT NULL,
    "description" TEXT,
    "image_url" TEXT,
    "nickname" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "goalRep" INTEGER NOT NULL,
    "discord_webhook_url" TEXT,
    "discord_invite_url" TEXT,
    "exercise_count" INTEGER NOT NULL DEFAULT 0,
    "total" INTEGER,
    "likeCount" INTEGER DEFAULT 0,
    "badges" "public"."Badges"[] DEFAULT ARRAY[]::"public"."Badges"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("group_id")
);

-- CreateTable
CREATE TABLE "public"."GroupUser" (
    "participant_id" SERIAL NOT NULL,
    "group_id" INTEGER NOT NULL,
    "nickname" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GroupUser_pkey" PRIMARY KEY ("participant_id")
);

-- CreateTable
CREATE TABLE "public"."Exercise" (
    "exercise_id" SERIAL NOT NULL,
    "group_user_id" INTEGER NOT NULL,
    "exerciseType" "public"."ExerciseType" NOT NULL,
    "description" VARCHAR(255),
    "time" INTEGER NOT NULL,
    "distance" INTEGER,
    "photos" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "group_id" INTEGER NOT NULL,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("exercise_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GroupUser_group_id_nickname_key" ON "public"."GroupUser"("group_id", "nickname");

-- AddForeignKey
ALTER TABLE "public"."GroupUser" ADD CONSTRAINT "GroupUser_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."Group"("group_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Exercise" ADD CONSTRAINT "Exercise_group_user_id_fkey" FOREIGN KEY ("group_user_id") REFERENCES "public"."GroupUser"("participant_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Exercise" ADD CONSTRAINT "Exercise_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."Group"("group_id") ON DELETE CASCADE ON UPDATE CASCADE;
