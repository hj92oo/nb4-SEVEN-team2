-- DropForeignKey
ALTER TABLE "public"."Exercise" DROP CONSTRAINT "Exercise_group_user_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."Exercise" ADD CONSTRAINT "Exercise_group_user_id_fkey" FOREIGN KEY ("group_user_id") REFERENCES "public"."GroupUser"("participant_id") ON DELETE CASCADE ON UPDATE CASCADE;
