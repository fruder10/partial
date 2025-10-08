import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getPrograms = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const programs = await prisma.program.findMany();
    res.json(programs);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving programs: ${error.message}` });
  }
};

export const createProgram = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, description, programManagerUserId, startDate, endDate } = req.body;
  try {
    const newProgram = await prisma.program.create({
      data: {
        name,
        description,
        programManagerUserId,
        startDate,
        endDate,
      },
    });
    res.status(201).json(newProgram);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error creating a program: ${error.message}` });
  }
};