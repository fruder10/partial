-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_disciplineTeamId_fkey";

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "disciplineTeamId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_disciplineTeamId_fkey" FOREIGN KEY ("disciplineTeamId") REFERENCES "public"."DisciplineTeam"("id") ON DELETE SET NULL ON UPDATE CASCADE;
