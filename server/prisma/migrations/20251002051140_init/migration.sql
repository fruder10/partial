/*
  Warnings:

  - You are about to drop the column `type` on the `WorkItem` table. All the data in the column will be lost.
  - Added the required column `workItemType` to the `WorkItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."WorkItem" DROP COLUMN "type",
ADD COLUMN     "workItemType" "public"."WorkItemType" NOT NULL;
