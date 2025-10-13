import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

// Define a type for creates
type WorkItemCreate = {
  workItemType: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  tags?: string;
  dateOpened?: string;
  dueDate: string;
  estimatedCompletionDate: string;
  actualCompletionDate?: string;
  percentComplete?: number;
  inputStatus?: string;
  programId: number;
  dueByMilestoneId: number;
  authorUserId: number;
  assignedUserId: number;
  issueDetail?: {
    issueType: string;
    rootCause?: string;
    correctiveAction?: string;
  };
  deliverableDetail?: {
    deliverableType: string;
  };
  partNumberIds?: number[];
};

// Define a type for updates
type WorkItemUpdate = {
  workItemType?: string;
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  tags?: string;
  dateOpened?: string;
  dueDate?: string;
  estimatedCompletionDate?: string;
  actualCompletionDate?: string;
  percentComplete?: number;
  inputStatus?: string;
  programId?: number;
  dueByMilestoneId?: number;
  authorUserId?: number;
  assignedUserId?: number;
  issueDetail?: {
    issueType?: string;
    rootCause?: string;
    correctiveAction?: string;
  };
  deliverableDetail?: {
    deliverableType?: string;
  };
  partNumberIds?: number[];
};

const prisma = new PrismaClient();

/**
 * Get WorkItems
 * Supports optional filtering by programId or partNumberId
 */
export const getWorkItems = async (req: Request, res: Response): Promise<void> => {
  const { programId, partNumberId } = req.query;

  try {
    let workItems;

    if (programId) {
      // ✅ filter by programId
      workItems = await prisma.workItem.findMany({
        where: { programId: Number(programId) },
        include: {
          program: true,
          dueByMilestone: true,
          deliverableDetail: true,
          issueDetail: true,
          authorUser: true,
          assigneeUser: true,
          partNumbers: {
            include: {
              partNumber: true,
            },
          },
          attachments: true,
          comments: true,
        },
      });
    } else if (partNumberId) {
      // ✅ filter by partNumberId (via WorkItemToPartNumber join table)
      workItems = await prisma.workItem.findMany({
        where: {
          partNumbers: {
            some: {
              partNumberId: Number(partNumberId),
            },
          },
        },
        include: {
          program: true,
          dueByMilestone: true,
          deliverableDetail: true,
          issueDetail: true,
          authorUser: true,
          assigneeUser: true,
          partNumbers: {
            include: {
              partNumber: true,
            },
          },
          attachments: true,
          comments: true,
        },
      });
    } else {
      // ✅ no filters → return all
      workItems = await prisma.workItem.findMany({
        include: {
          program: true,
          dueByMilestone: true,
          deliverableDetail: true,
          issueDetail: true,
          authorUser: true,
          assigneeUser: true,
          partNumbers: {
            include: {
              partNumber: true,
            },
          },
          attachments: true,
          comments: true,
        },
      });
    }

    res.json(workItems);
  } catch (error: any) {
    res.status(500).json({
      message: `Error retrieving work items: ${error.message}`,
    });
  }
};

/**
 * Get WorkItems by User
 */
export const getWorkItemsByUser = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  try {
    const workItems = await prisma.workItem.findMany({
      where: {
        OR: [
          { authorUserId: Number(userId) },
          { assignedUserId: Number(userId) },
        ],
      },
      include: {
        deliverableDetail: true,
        issueDetail: true,
        authorUser: true,
        assigneeUser: true,
      },
    });
    res.json(workItems);
  } catch (error: any) {
    res.status(500).json({ message: `Error retrieving work items by user: ${error.message}` });
  }
};

/**
 * Create WorkItem
 * Handles DeliverableDetail or IssueDetail based on type
 */
export const createWorkItem = async (req: Request, res: Response): Promise<void> => {
  const body = req.body as WorkItemCreate;

  try {
    // 1️⃣ Prepare WorkItem data
    const workItemData: any = {
      workItemType: body.workItemType,
      title: body.title,
      description: body.description,
      status: body.status,
      priority: body.priority,
      tags: body.tags,
      dateOpened: body.dateOpened ? new Date(body.dateOpened) : undefined,
      dueDate: new Date(body.dueDate),
      estimatedCompletionDate: new Date(body.estimatedCompletionDate),
      actualCompletionDate: body.actualCompletionDate ? new Date(body.actualCompletionDate) : undefined,
      percentComplete: body.percentComplete,
      inputStatus: body.inputStatus,
      programId: body.programId,
      dueByMilestoneId: body.dueByMilestoneId,
      authorUserId: body.authorUserId,
      assignedUserId: body.assignedUserId,
      // ✅ subtype creation
      issueDetail: body.issueDetail
        ? {
            create: {
              issueType: body.issueDetail.issueType,
              rootCause: body.issueDetail.rootCause,
              correctiveAction: body.issueDetail.correctiveAction,
            },
          }
        : undefined,
      deliverableDetail: body.deliverableDetail
        ? {
            create: {
              deliverableType: body.deliverableDetail.deliverableType,
            },
          }
        : undefined,
      // ✅ partNumber links
      partNumbers: body.partNumberIds?.length
        ? {
            create: body.partNumberIds.map((id) => ({
              partNumber: { connect: { id } },
            })),
          }
        : undefined,
    };

    // 2️⃣ Create WorkItem
    const newWorkItem = await prisma.workItem.create({
      data: workItemData,
      include: {
        program: true,
        dueByMilestone: true,
        deliverableDetail: true,
        issueDetail: true,
        authorUser: true,
        assigneeUser: true,
        comments: true,
        partNumbers: { include: { partNumber: true } },
      },
    });

    // 3️⃣ Flatten partNumberIds for frontend
    res.status(201).json({
      ...newWorkItem,
      partNumberIds: newWorkItem.partNumbers.map((p) => p.partNumberId),
    });
  } catch (error: any) {
    console.error("Error creating work item:", error);
    res.status(500).json({ message: `Error creating work item: ${error.message}` });
  }
};

/**
 * Update WorkItem Status
 */
export const updateWorkItemStatus = async (req: Request, res: Response): Promise<void> => {
  const { workItemId } = req.params;
  const { status } = req.body;
  try {
    const updatedWorkItem = await prisma.workItem.update({
      where: {
        id: Number(workItemId),
      },
      data: {
        status: status,
      },
    });
    res.json(updatedWorkItem);
  } catch (error: any) {
    res.status(500).json({ message: `Error updating work item status: ${error.message}` });
  }
};


export const editWorkItem = async (req: Request, res: Response) => {
  const { workItemId } = req.params;
  const updates = req.body as WorkItemUpdate;

  try {
    // 1️⃣ Update part numbers first
    if (Array.isArray(updates.partNumberIds)) {
      await prisma.workItemToPartNumber.deleteMany({
        where: { workItemId: Number(workItemId) },
      });

      if (updates.partNumberIds.length > 0) {
        await prisma.workItemToPartNumber.createMany({
          data: updates.partNumberIds.map((partNumberId) => ({
            workItemId: Number(workItemId),
            partNumberId,
          })),
        });
      }
    }

    // 2️⃣ Build the update object with type safety
    const updateData: any = {};

    if (updates.workItemType) updateData.workItemType = updates.workItemType;
    if (updates.title) updateData.title = updates.title;
    if (updates.description) updateData.description = updates.description;
    if (updates.status) updateData.status = updates.status;
    if (updates.priority) updateData.priority = updates.priority;
    if (updates.tags) updateData.tags = updates.tags;
    if (updates.dateOpened) updateData.dateOpened = new Date(updates.dateOpened);
    if (updates.dueDate) updateData.dueDate = new Date(updates.dueDate);
    if (updates.estimatedCompletionDate) updateData.estimatedCompletionDate = new Date(updates.estimatedCompletionDate);
    if (updates.actualCompletionDate) updateData.actualCompletionDate = new Date(updates.actualCompletionDate);
    if (typeof updates.percentComplete === "number") updateData.percentComplete = updates.percentComplete;
    if (updates.inputStatus) updateData.inputStatus = updates.inputStatus;
    if (updates.programId !== undefined) updateData.programId = updates.programId;
    if (updates.dueByMilestoneId !== undefined) updateData.dueByMilestoneId = updates.dueByMilestoneId;
    if (updates.authorUserId !== undefined) updateData.authorUserId = updates.authorUserId;
    if (updates.assignedUserId !== undefined) updateData.assignedUserId = updates.assignedUserId;

    if (updates.issueDetail) {
      updateData.issueDetail = {
        update: {
          ...(updates.issueDetail.issueType && { issueType: updates.issueDetail.issueType }),
          ...(updates.issueDetail.rootCause && { rootCause: updates.issueDetail.rootCause }),
          ...(updates.issueDetail.correctiveAction && { correctiveAction: updates.issueDetail.correctiveAction }),
        },
      };
    }

    if (updates.deliverableDetail) {
      updateData.deliverableDetail = {
        update: {
          ...(updates.deliverableDetail.deliverableType && { deliverableType: updates.deliverableDetail.deliverableType }),
        },
      };
    }

    // 3️⃣ Update WorkItem
    const updatedWorkItem = await prisma.workItem.update({
      where: { id: Number(workItemId) },
      data: updateData, // ✅ casted / type-safe object
      include: {
        program: true,
        dueByMilestone: true,
        deliverableDetail: true,
        issueDetail: true,
        authorUser: true,
        assigneeUser: true,
        comments: true,
        partNumbers: { include: { partNumber: true } },
      },
    });

    // 4️⃣ Flatten partNumberIds for frontend
    res.json({
      ...updatedWorkItem,
      partNumberIds: updatedWorkItem.partNumbers.map((p) => p.partNumberId),
    });
  } catch (error: any) {
    console.error("Error updating work item:", error);
    res.status(500).json({ message: `Error updating work item: ${error.message}` });
  }
};



/**
 * Delete WorkItem (and its subtype details)
 */
export const deleteWorkItem = async (req: Request, res: Response): Promise<void> => {
  const { workItemId } = req.params;

  try {
    // ✅ Clean up any dependent records first (subtypes, joins, attachments, comments)
    await prisma.comment.deleteMany({
      where: { workItemId: Number(workItemId) },
    });

    await prisma.attachment.deleteMany({
      where: { workItemId: Number(workItemId) },
    });

    await prisma.workItemToPartNumber.deleteMany({
      where: { workItemId: Number(workItemId) },
    });

    // Delete subtype records first to respect foreign key constraints
    await prisma.issueDetail.deleteMany({
      where: { id: Number(workItemId) },
    });

    await prisma.deliverableDetail.deleteMany({
      where: { id: Number(workItemId) },
    });

    // Finally, delete the WorkItem itself
    await prisma.workItem.delete({
      where: { id: Number(workItemId) },
    });

    res.status(200).json({ message: `Work item ${workItemId} deleted successfully.` });
  } catch (error: any) {
    console.error("Error deleting work item:", error);
    res.status(500).json({ message: `Error deleting work item: ${error.message}` });
  }
};


