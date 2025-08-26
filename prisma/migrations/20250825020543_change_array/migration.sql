/*
  Warnings:

  - The `photos` column on the `Exercise` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Exercise" DROP COLUMN "photos",
ADD COLUMN     "photos" TEXT[];
