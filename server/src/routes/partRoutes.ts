import { Router } from "express";
import { createPart, getParts, getPartsByProgram, getPartsByUser } from "../controllers/partController"

const router = Router();

router.get("/", getParts);
router.get("/by-program", getPartsByProgram);
router.get("/user/:userId", getPartsByUser);
router.post("/", createPart);

export default router;