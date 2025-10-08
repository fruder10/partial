import { Router } from "express";
import { createProgram, getPrograms } from "../controllers/programController";

const router = Router();

router.get("/", getPrograms);
router.post("/", createProgram);

export default router;