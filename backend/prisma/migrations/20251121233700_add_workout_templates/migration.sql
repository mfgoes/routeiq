-- AlterTable
ALTER TABLE "workouts" ADD COLUMN     "is_template" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "started_at" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "workouts_user_id_is_template_idx" ON "workouts"("user_id", "is_template");
