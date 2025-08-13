/*
  Warnings:

  - The primary key for the `Group` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `discord_invite_url` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `discord_webhook_url` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `group_id` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `group_name` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `nickname` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Group` table. All the data in the column will be lost.
  - The `tags` column on the `Group` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `name` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Group" DROP CONSTRAINT "Group_pkey",
DROP COLUMN "created_at",
DROP COLUMN "discord_invite_url",
DROP COLUMN "discord_webhook_url",
DROP COLUMN "group_id",
DROP COLUMN "group_name",
DROP COLUMN "nickname",
DROP COLUMN "updated_at",
ADD COLUMN     "badges" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "discordInviteUrl" TEXT,
ADD COLUMN     "discordWebhookUrl" TEXT,
ADD COLUMN     "goalRep" INTEGER,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "likeCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "photoUrl" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "tags",
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD CONSTRAINT "Group_pkey" PRIMARY KEY ("id");
