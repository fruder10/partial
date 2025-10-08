/*
  Warnings:

  - You are about to drop the column `fileURL` on the `Attachment` table. All the data in the column will be lost.
  - You are about to drop the column `uploadedById` on the `Attachment` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `points` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Task` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `teamId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProjectTeam` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TaskAssignment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Team` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fileUrl` to the `Attachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uploadedByUserId` to the `Attachment` table without a default value. This is not possible if the table is not empty.
  - Made the column `fileName` on table `Attachment` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `commenterUserId` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dueByMilestoneId` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estimatedCompletionDate` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inputStatus` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `percentComplete` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `programId` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Task` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `Task` required. This step will fail if there are existing NULL values in that column.
  - Made the column `priority` on table `Task` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dueDate` on table `Task` required. This step will fail if there are existing NULL values in that column.
  - Made the column `assignedUserId` on table `Task` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `disciplineTeamId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Attachment" DROP CONSTRAINT "Attachment_taskId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Attachment" DROP CONSTRAINT "Attachment_uploadedById_fkey";

-- DropForeignKey
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Comment_taskId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProjectTeam" DROP CONSTRAINT "ProjectTeam_projectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProjectTeam" DROP CONSTRAINT "ProjectTeam_teamId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Task" DROP CONSTRAINT "Task_assignedUserId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Task" DROP CONSTRAINT "Task_authorUserId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Task" DROP CONSTRAINT "Task_projectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TaskAssignment" DROP CONSTRAINT "TaskAssignment_taskId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TaskAssignment" DROP CONSTRAINT "TaskAssignment_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_teamId_fkey";

-- AlterTable
ALTER TABLE "public"."Attachment" DROP COLUMN "fileURL",
DROP COLUMN "uploadedById",
ADD COLUMN     "dateAttached" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deliverableId" INTEGER,
ADD COLUMN     "fileUrl" TEXT NOT NULL,
ADD COLUMN     "issueId" INTEGER,
ADD COLUMN     "uploadedByUserId" INTEGER NOT NULL,
ALTER COLUMN "fileName" SET NOT NULL,
ALTER COLUMN "taskId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Comment" DROP COLUMN "userId",
ADD COLUMN     "commenterUserId" INTEGER NOT NULL,
ADD COLUMN     "dateCommented" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deliverableId" INTEGER,
ADD COLUMN     "issueId" INTEGER,
ALTER COLUMN "taskId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Task" DROP COLUMN "points",
DROP COLUMN "projectId",
DROP COLUMN "startDate",
ADD COLUMN     "actualCompletionDate" TIMESTAMP(3),
ADD COLUMN     "dateOpened" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deliverableId" INTEGER,
ADD COLUMN     "dueByMilestoneId" INTEGER NOT NULL,
ADD COLUMN     "estimatedCompletionDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "inputStatus" TEXT NOT NULL,
ADD COLUMN     "issueId" INTEGER,
ADD COLUMN     "percentComplete" INTEGER NOT NULL,
ADD COLUMN     "programId" INTEGER NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "priority" SET NOT NULL,
ALTER COLUMN "dueDate" SET NOT NULL,
ALTER COLUMN "assignedUserId" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "teamId",
DROP COLUMN "userId",
ADD COLUMN     "disciplineTeamId" INTEGER NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" INTEGER NOT NULL,
ADD COLUMN     "role" TEXT NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "public"."Project";

-- DropTable
DROP TABLE "public"."ProjectTeam";

-- DropTable
DROP TABLE "public"."TaskAssignment";

-- DropTable
DROP TABLE "public"."Team";

-- CreateTable
CREATE TABLE "public"."DisciplineTeam" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "teamManagerUserId" INTEGER NOT NULL,

    CONSTRAINT "DisciplineTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Program" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "programManagerUserId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DisciplineTeamToProgram" (
    "id" SERIAL NOT NULL,
    "disciplineTeamId" INTEGER NOT NULL,
    "programId" INTEGER NOT NULL,

    CONSTRAINT "DisciplineTeamToProgram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Milestone" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "programId" INTEGER NOT NULL,

    CONSTRAINT "Milestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PartNumber" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "partName" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "state" TEXT NOT NULL,
    "revisionLevel" TEXT NOT NULL,
    "assignedUserId" INTEGER NOT NULL,
    "programId" INTEGER NOT NULL,
    "parentId" INTEGER,

    CONSTRAINT "PartNumber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Issue" (
    "id" SERIAL NOT NULL,
    "issueType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "tags" TEXT,
    "rootCause" TEXT,
    "correctiveAction" TEXT,
    "dateOpened" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "estimatedCompletionDate" TIMESTAMP(3) NOT NULL,
    "actualCompletionDate" TIMESTAMP(3),
    "percentComplete" INTEGER NOT NULL,
    "inputStatus" TEXT NOT NULL,
    "programId" INTEGER NOT NULL,
    "dueByMilestoneId" INTEGER NOT NULL,
    "deliverableId" INTEGER,
    "authorUserId" INTEGER NOT NULL,
    "assignedUserId" INTEGER NOT NULL,

    CONSTRAINT "Issue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Deliverable" (
    "id" SERIAL NOT NULL,
    "deliverableType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "tags" TEXT,
    "dateOpened" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "estimatedCompletionDate" TIMESTAMP(3) NOT NULL,
    "actualCompletionDate" TIMESTAMP(3),
    "percentComplete" INTEGER NOT NULL,
    "inputStatus" TEXT NOT NULL,
    "programId" INTEGER NOT NULL,
    "dueByMilestoneId" INTEGER NOT NULL,
    "authorUserId" INTEGER NOT NULL,
    "assignedUserId" INTEGER NOT NULL,

    CONSTRAINT "Deliverable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."IssueToPartNumber" (
    "id" SERIAL NOT NULL,
    "issueId" INTEGER NOT NULL,
    "partNumberId" INTEGER NOT NULL,

    CONSTRAINT "IssueToPartNumber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DeliverableToPartNumber" (
    "id" SERIAL NOT NULL,
    "deliverableId" INTEGER NOT NULL,
    "partNumberId" INTEGER NOT NULL,

    CONSTRAINT "DeliverableToPartNumber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TaskToPartNumber" (
    "id" SERIAL NOT NULL,
    "taskId" INTEGER NOT NULL,
    "partNumberId" INTEGER NOT NULL,

    CONSTRAINT "TaskToPartNumber_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DisciplineTeam_teamManagerUserId_key" ON "public"."DisciplineTeam"("teamManagerUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Program_programManagerUserId_key" ON "public"."Program"("programManagerUserId");

-- CreateIndex
CREATE UNIQUE INDEX "PartNumber_number_key" ON "public"."PartNumber"("number");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_disciplineTeamId_fkey" FOREIGN KEY ("disciplineTeamId") REFERENCES "public"."DisciplineTeam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DisciplineTeam" ADD CONSTRAINT "DisciplineTeam_teamManagerUserId_fkey" FOREIGN KEY ("teamManagerUserId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Program" ADD CONSTRAINT "Program_programManagerUserId_fkey" FOREIGN KEY ("programManagerUserId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DisciplineTeamToProgram" ADD CONSTRAINT "DisciplineTeamToProgram_disciplineTeamId_fkey" FOREIGN KEY ("disciplineTeamId") REFERENCES "public"."DisciplineTeam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DisciplineTeamToProgram" ADD CONSTRAINT "DisciplineTeamToProgram_programId_fkey" FOREIGN KEY ("programId") REFERENCES "public"."Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Milestone" ADD CONSTRAINT "Milestone_programId_fkey" FOREIGN KEY ("programId") REFERENCES "public"."Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PartNumber" ADD CONSTRAINT "PartNumber_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PartNumber" ADD CONSTRAINT "PartNumber_programId_fkey" FOREIGN KEY ("programId") REFERENCES "public"."Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PartNumber" ADD CONSTRAINT "PartNumber_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."PartNumber"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Issue" ADD CONSTRAINT "Issue_programId_fkey" FOREIGN KEY ("programId") REFERENCES "public"."Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Issue" ADD CONSTRAINT "Issue_dueByMilestoneId_fkey" FOREIGN KEY ("dueByMilestoneId") REFERENCES "public"."Milestone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Issue" ADD CONSTRAINT "Issue_deliverableId_fkey" FOREIGN KEY ("deliverableId") REFERENCES "public"."Deliverable"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Issue" ADD CONSTRAINT "Issue_authorUserId_fkey" FOREIGN KEY ("authorUserId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Issue" ADD CONSTRAINT "Issue_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Deliverable" ADD CONSTRAINT "Deliverable_programId_fkey" FOREIGN KEY ("programId") REFERENCES "public"."Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Deliverable" ADD CONSTRAINT "Deliverable_dueByMilestoneId_fkey" FOREIGN KEY ("dueByMilestoneId") REFERENCES "public"."Milestone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Deliverable" ADD CONSTRAINT "Deliverable_authorUserId_fkey" FOREIGN KEY ("authorUserId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Deliverable" ADD CONSTRAINT "Deliverable_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Task" ADD CONSTRAINT "Task_programId_fkey" FOREIGN KEY ("programId") REFERENCES "public"."Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Task" ADD CONSTRAINT "Task_dueByMilestoneId_fkey" FOREIGN KEY ("dueByMilestoneId") REFERENCES "public"."Milestone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Task" ADD CONSTRAINT "Task_deliverableId_fkey" FOREIGN KEY ("deliverableId") REFERENCES "public"."Deliverable"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Task" ADD CONSTRAINT "Task_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "public"."Issue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Task" ADD CONSTRAINT "Task_authorUserId_fkey" FOREIGN KEY ("authorUserId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Task" ADD CONSTRAINT "Task_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."IssueToPartNumber" ADD CONSTRAINT "IssueToPartNumber_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "public"."Issue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."IssueToPartNumber" ADD CONSTRAINT "IssueToPartNumber_partNumberId_fkey" FOREIGN KEY ("partNumberId") REFERENCES "public"."PartNumber"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DeliverableToPartNumber" ADD CONSTRAINT "DeliverableToPartNumber_deliverableId_fkey" FOREIGN KEY ("deliverableId") REFERENCES "public"."Deliverable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DeliverableToPartNumber" ADD CONSTRAINT "DeliverableToPartNumber_partNumberId_fkey" FOREIGN KEY ("partNumberId") REFERENCES "public"."PartNumber"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TaskToPartNumber" ADD CONSTRAINT "TaskToPartNumber_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TaskToPartNumber" ADD CONSTRAINT "TaskToPartNumber_partNumberId_fkey" FOREIGN KEY ("partNumberId") REFERENCES "public"."PartNumber"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Attachment" ADD CONSTRAINT "Attachment_uploadedByUserId_fkey" FOREIGN KEY ("uploadedByUserId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Attachment" ADD CONSTRAINT "Attachment_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "public"."Issue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Attachment" ADD CONSTRAINT "Attachment_deliverableId_fkey" FOREIGN KEY ("deliverableId") REFERENCES "public"."Deliverable"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Attachment" ADD CONSTRAINT "Attachment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_commenterUserId_fkey" FOREIGN KEY ("commenterUserId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "public"."Issue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_deliverableId_fkey" FOREIGN KEY ("deliverableId") REFERENCES "public"."Deliverable"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;
