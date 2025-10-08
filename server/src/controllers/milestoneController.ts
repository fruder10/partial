import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getMilestones = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const milestones = await prisma.milestone.findMany();
    res.json(milestones);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving milestones: ${error.message}` });
  }
};

export const getMilestonesByProgram = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {programId} = req.query;
  try {
    const milestones = await prisma.milestone.findMany({ // GRAB MILESTONES SPECIFICALLY FROM THAT PROGRAM ID
        where: {
            programId: Number(programId),
        },
        include: {
            program: true,
            workItems: true
        },
    });
    res.json(milestones);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving milestones by program: ${error.message}` });
  }
};

export const createMilestone = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, description, date, programId } = req.body;
  try {
    const newMilestone = await prisma.milestone.create({
      data: {
        name,
        description,
        date,
        programId
      },
    });
    res.status(201).json(newMilestone);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error creating a milestone: ${error.message}` });
  }
};