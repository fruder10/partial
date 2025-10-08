import { Router } from "express";
import { createMilestone, getMilestones, getMilestonesByProgram } from "../controllers/milestoneController";

const router = Router();

router.get("/", getMilestones);
router.get("/milestones/by-program", getMilestonesByProgram);
router.post("/", createMilestone);

export default router;