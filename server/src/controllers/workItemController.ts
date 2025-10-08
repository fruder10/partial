import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

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
  const {
    workItemType,
    title,
    description,
    status,
    priority,
    tags,
    dateOpened,
    dueDate,
    estimatedCompletionDate,
    actualCompletionDate,
    percentComplete,
    inputStatus,
    programId,
    dueByMilestoneId,
    authorUserId,
    assignedUserId,
    deliverableType,
    issueType,
    rootCause,
    correctiveAction,
  } = req.body;

  try {
    const newWorkItem = await prisma.workItem.create({
      data: {
        workItemType,
        title,
        description,
        status,
        priority,
        tags,
        dateOpened,
        dueDate,
        estimatedCompletionDate,
        actualCompletionDate,
        percentComplete,
        inputStatus,
        programId,
        dueByMilestoneId,
        authorUserId,
        assignedUserId,
        // ✅ create subtype record depending on work item type
        deliverableDetail: deliverableType
          ? {
              create: {
                deliverableType,
              },
            }
          : undefined,
        issueDetail: issueType
          ? {
              create: {
                issueType,
                rootCause,
                correctiveAction,
              },
            }
          : undefined,
      },
      include: {
        deliverableDetail: true,
        issueDetail: true,
      },
    });
    res.status(201).json(newWorkItem);
  } catch (error: any) {
    res.status(500).json({ message: `Error creating a work item: ${error.message}` });
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

/**
 * Edit (update) WorkItem
 */
export const editWorkItem = async (req: Request, res: Response): Promise<void> => {
  const { workItemId } = req.params;
  const updates = req.body; // Partial<WorkItem>

  try {
    // Build the update payload safely
    const updatedWorkItem = await prisma.workItem.update({
      where: { id: Number(workItemId) },
      data: {
        ...(updates.workItemType && { workItemType: updates.workItemType }),
        ...(updates.title && { title: updates.title }),
        ...(updates.description && { description: updates.description }),
        ...(updates.status && { status: updates.status }),
        ...(updates.priority && { priority: updates.priority }),
        ...(updates.tags && { tags: updates.tags }),
        ...(updates.dateOpened && { dateOpened: new Date(updates.dateOpened) }),
        ...(updates.dueDate && { dueDate: new Date(updates.dueDate) }),
        ...(updates.estimatedCompletionDate && {
          estimatedCompletionDate: new Date(updates.estimatedCompletionDate),
        }),
        ...(updates.actualCompletionDate && {
          actualCompletionDate: new Date(updates.actualCompletionDate),
        }),
        ...(typeof updates.percentComplete === "number" && {
          percentComplete: updates.percentComplete,
        }),
        ...(updates.inputStatus && { inputStatus: updates.inputStatus }),
        ...(updates.programId && { programId: updates.programId }),
        ...(updates.dueByMilestoneId && { dueByMilestoneId: updates.dueByMilestoneId }),
        ...(updates.authorUserId && { authorUserId: updates.authorUserId }),
        ...(updates.assignedUserId && { assignedUserId: updates.assignedUserId }),

        ...(updates.issueDetail && {
          issueDetail: {
            update: {
              ...(updates.issueDetail.issueType && {
                issueType: updates.issueDetail.issueType,
              }),
              ...(updates.issueDetail.rootCause && {
                rootCause: updates.issueDetail.rootCause,
              }),
              ...(updates.issueDetail.correctiveAction && {
                correctiveAction: updates.issueDetail.correctiveAction,
              }),
            },
          },
        }),

        ...(updates.deliverableDetail && {
          deliverableDetail: {
            update: {
              ...(updates.deliverableDetail.deliverableType && {
                deliverableType: updates.deliverableDetail.deliverableType,
              }),
            },
          },
        }),
      },
      include: {
        program: true,
        dueByMilestone: true,
        deliverableDetail: true,
        issueDetail: true,
        authorUser: true,
        assigneeUser: true,
        comments: true,
      },
    });

    res.json(updatedWorkItem);
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


