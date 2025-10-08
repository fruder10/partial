/*
  Warnings:

  - You are about to drop the column `deliverableId` on the `Attachment` table. All the data in the column will be lost.
  - You are about to drop the column `issueId` on the `Attachment` table. All the data in the column will be lost.
  - You are about to drop the column `taskId` on the `Attachment` table. All the data in the column will be lost.
  - You are about to drop the column `deliverableId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `issueId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `taskId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the `Deliverable` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DeliverableToPartNumber` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Issue` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IssueToPartNumber` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TaskToPartNumber` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."Priority" AS ENUM ('Urgent', 'High', 'Medium', 'Low', 'Backlog');

-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('ToDo', 'WorkInProgress', 'UnderReview', 'Completed');

-- CreateEnum
CREATE TYPE "public"."DeliverableType" AS ENUM ('SystemSubsystemRequirementsSpecificationSRS', 'InterfaceControlDocumentICD', 'PreliminaryDesignReviewPDRPackage', 'RiskFailureModeEffectsAnalysisFMEADFMEAReport', 'DevelopmentVerificationPlanVVMatrix', 'EngineeringDrawingCADModel', 'BillofMaterialsBOM', 'StressStructuralAnalysisReport', 'ThermalAnalysisReport', 'ElectricalSchematicsPCBLayouts', 'DesignforManufacturabilityDFMDesignforTestDFTReviewReport', 'CriticalDesignReviewCDRPackage', 'WorkInstructionsAssemblyProcedures', 'FirstArticleInspectionFAIReport', 'SupplierQualityRecordsCertificatesofConformanceCoC', 'TestPlansandProcedures', 'QualificationTestReport', 'AcceptanceTestProcedureATPReport', 'CalibrationCertificates', 'NonConformanceCorrectiveActionReportNCRCAR', 'RequirementsVerificationReport', 'AsBuiltConfigurationEndItemDataPackage', 'UserOperationsManual', 'MaintenanceRepairManualSparePartsList', 'CertificatesofCompliance', 'LessonsLearnedPostProjectReport', 'Other');

-- CreateEnum
CREATE TYPE "public"."IssueType" AS ENUM ('Defect', 'Failure', 'RequirementWaiver', 'NonConformanceReportNCR', 'ProcessManufacturingIssue', 'SupplyChainProcurementIssue', 'IntegrationInterfaceIssue', 'TestVerificationAnomaly', 'EnvironmentalReliabilityIssue', 'ConfigurationDocumentationControlIssue', 'SafetyRegulatoryIssue', 'ProgrammaticRiskItem', 'ObsolescenceEndOfLifeIssue', 'Other');

-- CreateEnum
CREATE TYPE "public"."WorkItemType" AS ENUM ('Task', 'Deliverable', 'Issue');

-- DropForeignKey
ALTER TABLE "public"."Attachment" DROP CONSTRAINT "Attachment_deliverableId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Attachment" DROP CONSTRAINT "Attachment_issueId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Attachment" DROP CONSTRAINT "Attachment_taskId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Comment_deliverableId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Comment_issueId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Comment_taskId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Deliverable" DROP CONSTRAINT "Deliverable_assignedUserId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Deliverable" DROP CONSTRAINT "Deliverable_authorUserId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Deliverable" DROP CONSTRAINT "Deliverable_dueByMilestoneId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Deliverable" DROP CONSTRAINT "Deliverable_programId_fkey";

-- DropForeignKey
ALTER TABLE "public"."DeliverableToPartNumber" DROP CONSTRAINT "DeliverableToPartNumber_deliverableId_fkey";

-- DropForeignKey
ALTER TABLE "public"."DeliverableToPartNumber" DROP CONSTRAINT "DeliverableToPartNumber_partNumberId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Issue" DROP CONSTRAINT "Issue_assignedUserId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Issue" DROP CONSTRAINT "Issue_authorUserId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Issue" DROP CONSTRAINT "Issue_dueByMilestoneId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Issue" DROP CONSTRAINT "Issue_programId_fkey";

-- DropForeignKey
ALTER TABLE "public"."IssueToPartNumber" DROP CONSTRAINT "IssueToPartNumber_issueId_fkey";

-- DropForeignKey
ALTER TABLE "public"."IssueToPartNumber" DROP CONSTRAINT "IssueToPartNumber_partNumberId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Task" DROP CONSTRAINT "Task_assignedUserId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Task" DROP CONSTRAINT "Task_authorUserId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Task" DROP CONSTRAINT "Task_deliverableId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Task" DROP CONSTRAINT "Task_dueByMilestoneId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Task" DROP CONSTRAINT "Task_issueId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Task" DROP CONSTRAINT "Task_programId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TaskToPartNumber" DROP CONSTRAINT "TaskToPartNumber_partNumberId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TaskToPartNumber" DROP CONSTRAINT "TaskToPartNumber_taskId_fkey";

-- AlterTable
ALTER TABLE "public"."Attachment" DROP COLUMN "deliverableId",
DROP COLUMN "issueId",
DROP COLUMN "taskId",
ADD COLUMN     "workItemId" INTEGER;

-- AlterTable
ALTER TABLE "public"."Comment" DROP COLUMN "deliverableId",
DROP COLUMN "issueId",
DROP COLUMN "taskId",
ADD COLUMN     "workItemId" INTEGER;

-- DropTable
DROP TABLE "public"."Deliverable";

-- DropTable
DROP TABLE "public"."DeliverableToPartNumber";

-- DropTable
DROP TABLE "public"."Issue";

-- DropTable
DROP TABLE "public"."IssueToPartNumber";

-- DropTable
DROP TABLE "public"."Task";

-- DropTable
DROP TABLE "public"."TaskToPartNumber";

-- CreateTable
CREATE TABLE "public"."WorkItem" (
    "id" SERIAL NOT NULL,
    "type" "public"."WorkItemType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "public"."Status" NOT NULL,
    "priority" "public"."Priority" NOT NULL,
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

    CONSTRAINT "WorkItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."IssueDetail" (
    "id" INTEGER NOT NULL,
    "issueType" "public"."IssueType" NOT NULL,
    "rootCause" TEXT,
    "correctiveAction" TEXT,

    CONSTRAINT "IssueDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DeliverableDetail" (
    "id" INTEGER NOT NULL,
    "deliverableType" "public"."DeliverableType" NOT NULL,

    CONSTRAINT "DeliverableDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WorkItemToPartNumber" (
    "id" SERIAL NOT NULL,
    "workItemId" INTEGER NOT NULL,
    "partNumberId" INTEGER NOT NULL,

    CONSTRAINT "WorkItemToPartNumber_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."WorkItem" ADD CONSTRAINT "WorkItem_programId_fkey" FOREIGN KEY ("programId") REFERENCES "public"."Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkItem" ADD CONSTRAINT "WorkItem_dueByMilestoneId_fkey" FOREIGN KEY ("dueByMilestoneId") REFERENCES "public"."Milestone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkItem" ADD CONSTRAINT "WorkItem_authorUserId_fkey" FOREIGN KEY ("authorUserId") REFERENCES "public"."User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkItem" ADD CONSTRAINT "WorkItem_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "public"."User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."IssueDetail" ADD CONSTRAINT "IssueDetail_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."WorkItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DeliverableDetail" ADD CONSTRAINT "DeliverableDetail_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."WorkItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkItemToPartNumber" ADD CONSTRAINT "WorkItemToPartNumber_workItemId_fkey" FOREIGN KEY ("workItemId") REFERENCES "public"."WorkItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkItemToPartNumber" ADD CONSTRAINT "WorkItemToPartNumber_partNumberId_fkey" FOREIGN KEY ("partNumberId") REFERENCES "public"."PartNumber"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Attachment" ADD CONSTRAINT "Attachment_workItemId_fkey" FOREIGN KEY ("workItemId") REFERENCES "public"."WorkItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_workItemId_fkey" FOREIGN KEY ("workItemId") REFERENCES "public"."WorkItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
