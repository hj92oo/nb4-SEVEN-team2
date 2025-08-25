-- AlterTable
ALTER TABLE "public"."Exercise" ALTER COLUMN "photos" DROP NOT NULL,
ALTER COLUMN "photos" SET DATA TYPE TEXT;
