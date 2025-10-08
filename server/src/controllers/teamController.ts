import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getTeams = async (req: Request, res: Response): Promise<void> => {
  try {
    const teams = await prisma.disciplineTeam.findMany();

    const teamsWithUsernames = await Promise.all(
      teams.map(async (team: any) => {
        const teamManager = await prisma.user.findUnique({
          where: { userId: team.teamManagerUserId! },
          select: { username: true },
        });

        return {
          ...team,
          teamManagerUsername: teamManager?.username,
        };
      })
    );

    res.json(teamsWithUsernames);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving discipline teams: ${error.message}` });
  }
};

export const createTeam = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, description, teamManagerUserId } = req.body;
  try {
    const newTeam = await prisma.disciplineTeam.create({
      data: {
        name,
        description,
        teamManagerUserId,
      },
    });
    res.status(201).json(newTeam);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error creating a team: ${error.message}` });
  }
};