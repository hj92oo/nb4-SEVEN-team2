/*
  Warnings:

  - The primary key for the `Group` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `badges` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `discordInviteUrl` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `discordWebhookUrl` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `goalRep` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `likeCount` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `photoUrl` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Group` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Group" DROP CONSTRAINT "Group_pkey",
DROP COLUMN "badges",
DROP COLUMN "createdAt",
DROP COLUMN "discordInviteUrl",
DROP COLUMN "discordWebhookUrl",
DROP COLUMN "goalRep",
DROP COLUMN "id",
DROP COLUMN "likeCount",
DROP COLUMN "name",
DROP COLUMN "photoUrl",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "discord_invite_url" TEXT,
ADD COLUMN     "discord_webhook_url" TEXT,
ADD COLUMN     "group_id" SERIAL NOT NULL,
ADD COLUMN     "group_name" TEXT NOT NULL DEFAULT '기본 그룹명',
ADD COLUMN     "nickname" TEXT NOT NULL DEFAULT '기본 닉네임',
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "tags" DROP NOT NULL,
ALTER COLUMN "tags" DROP DEFAULT,
ALTER COLUMN "tags" SET DATA TYPE TEXT,
ADD CONSTRAINT "Group_pkey" PRIMARY KEY ("group_id");
