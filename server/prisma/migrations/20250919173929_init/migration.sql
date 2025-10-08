-- DropForeignKey
ALTER TABLE "public"."DisciplineTeam" DROP CONSTRAINT "DisciplineTeam_teamManagerUserId_fkey";

-- DropIndex
DROP INDEX "public"."DisciplineTeam_teamManagerUserId_key";

-- AlterTable
ALTER TABLE "public"."DisciplineTeam" ALTER COLUMN "teamManagerUserId" DROP NOT NULL;
