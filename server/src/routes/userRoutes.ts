import { Router } from "express";
import { getUsers, getUserById } from "../controllers/userController";

const router = Router();

router.get("/", getUsers);
router.get("/:userId", getUserById);

export default router;