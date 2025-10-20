import { Request, Response } from "express";
import { PrismaClient, WorkItemType } from "@prisma/client";

const prisma = new PrismaClient();

export const search = async (req: Request, res: Response): Promise<void> => {
  const raw = req.query.query;
  const query = typeof raw === "string" ? raw : "";

  try {
    // 🔎 Search across all WorkItems
    const workItems = await prisma.workItem.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { tags: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        issueDetail: true,
        deliverableDetail: true,
        program: true,
        dueByMilestone: true,
        authorUser: true,
        assigneeUser: true,
        partNumbers: {
          include: { partNumber: true },
        },
      },
    });

    // 🔎 Other entities
    const programs = await prisma.program.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        partNumbers: true,
        disciplineTeams: {
          include: {
            disciplineTeam: true,
          },
        },
        milestones: true,
        workItems: true,
      },
    });

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: query, mode: "insensitive" } },
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
          { phoneNumber: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        disciplineTeam: true,
        authoredWorkItems: true,
        assignedWorkItems: true,
        partNumbers: true,
      },
    });

    const milestones = await prisma.milestone.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        program: true,
        workItems: true,
      },
    });

    const partNumbers = await prisma.partNumber.findMany({
      where: {
        OR: [
          ...(Number.isFinite(Number(query))
            ? [{ number: Number(query) }]
            : []),
          { partName: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        assignedUser: true,
        program: true,
        parent: true,
        children: true,
      },
    });

    res.json({
      workItems,   // ✅ unified
      programs,
      users,
      milestones,
      partNumbers,
    });
  } catch (error: any) {
    res.status(500).json({ message: `Error performing search: ${error.message}` });
  }
};