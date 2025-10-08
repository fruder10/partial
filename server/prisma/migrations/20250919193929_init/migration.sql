/*
  Warnings:

  - A unique constraint covering the columns `[teamManagerUserId]` on the table `DisciplineTeam` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."Program" DROP CONSTRAINT "Program_programManagerUserId_fkey";

-- AlterTable
ALTER TABLE "public"."Program" ALTER COLUMN "programManagerUserId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "DisciplineTeam_teamManagerUserId_key" ON "public"."DisciplineTeam"("teamManagerUserId");

-- AddForeignKey
ALTER TABLE "public"."DisciplineTeam" ADD CONSTRAINT "DisciplineTeam_teamManagerUserId_fkey" FOREIGN KEY ("teamManagerUserId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Program" ADD CONSTRAINT "Program_programManagerUserId_fkey" FOREIGN KEY ("programManagerUserId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
