/*
  Warnings:

  - You are about to alter the column `photos` on the `Exercise` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "public"."Exercise" ALTER COLUMN "photos" DROP NOT NULL,
ALTER COLUMN "photos" DROP DEFAULT,
ALTER COLUMN "photos" SET DATA TYPE VARCHAR(255);
