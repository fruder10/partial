-- DropForeignKey
ALTER TABLE "public"."DisciplineTeam" DROP CONSTRAINT "DisciplineTeam_teamManagerUserId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Issue" DROP CONSTRAINT "Issue_deliverableId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Program" DROP CONSTRAINT "Program_programManagerUserId_fkey";

-- DropIndex
DROP INDEX "public"."DisciplineTeam_teamManagerUserId_key";

-- DropIndex
DROP INDEX "public"."Program_programManagerUserId_key";
