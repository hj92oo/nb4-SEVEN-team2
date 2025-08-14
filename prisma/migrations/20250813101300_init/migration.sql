/*
  Warnings:

  - Added the required column `nickname` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Group" ADD COLUMN     "nickname" TEXT NOT NULL;
