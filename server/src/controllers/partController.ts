import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getParts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const parts = await prisma.partNumber.findMany();
    res.json(parts);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving part numbers: ${error.message}` });
  }
};

export const getPartsByProgram = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {programId} = req.query;
  try {
    const parts = await prisma.partNumber.findMany({ // GRAB PART NUMBERS SPECIFICALLY FROM THAT PROGRAM ID
        where: {
            programId: Number(programId),
        },
        include: {
            assignedUser: true,
            program: true,
            parent: true,
            children: true,
        },
    });
    res.json(parts);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving part numbers by program: ${error.message}` });
  }
};

export const getPartsByUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;
  try {
    const parts = await prisma.partNumber.findMany({ // GRAB PART NUMBERS SPECIFICALLY FOR THAT USER
        where: {
            assignedUserId: Number(userId),
        },
        include: {
            //assignedUser: true,
            //program: true,
            parent: true,
            children: true,
        },
    });
    res.json(parts);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving part numbers by user: ${error.message}` });
  }
};

export const createPart = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { number, partName, level, state, revisionLevel, assignedUserId, programId, parentId } = req.body;
  try {
    const newPart = await prisma.partNumber.create({
      data: {
        number,
        partName,
        level,
        state,
        revisionLevel,
        assignedUserId,
        programId,
        parentId
      },
    });
    res.status(201).json(newPart);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error creating a part number: ${error.message}` });
  }
};