import express from "express";
import {
  getWorkItems,
  getWorkItemById,
  getWorkItemsByUser,
  createWorkItem,
  updateWorkItemStatus,
  editWorkItem,
  deleteWorkItem,
} from "../controllers/workItemController";

const router = express.Router();

// ✅ GET all work items (optionally filter by programId or partNumberId)
router.get("/", getWorkItems);

// ✅ GET all work items authored or assigned to a user
router.get("/user/:userId", getWorkItemsByUser);

// ✅ GET single work item by ID (must be last to avoid conflicts)
router.get("/:workItemId", getWorkItemById);

// ✅ CREATE a new work item (with DeliverableDetail or IssueDetail if applicable)
router.post("/", createWorkItem);

// ✅ UPDATE status of a work item
router.patch("/:workItemId/status", updateWorkItemStatus);

// ✅ EDIT (PATCH) a work item
router.patch("/:workItemId", editWorkItem);

// ✅ DELETE a work item (and its related details)
router.delete("/:workItemId", deleteWorkItem);

export default router;
