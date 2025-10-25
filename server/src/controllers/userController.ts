import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      include: {
        disciplineTeam: true,
        authoredWorkItems: true,
        assignedWorkItems: true,
        partNumbers: true,
      },
    });
    res.json(users);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving users: ${error.message}` });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { userId: Number(userId) },
      include: {
        disciplineTeam: true,
        authoredWorkItems: {
          include: {
            program: true,
            dueByMilestone: true,
            assigneeUser: true,
          },
        },
        assignedWorkItems: {
          include: {
            program: true,
            dueByMilestone: true,
            authorUser: true,
          },
        },
        partNumbers: true,
      },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(user);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving user: ${error.message}` });
  }
};
