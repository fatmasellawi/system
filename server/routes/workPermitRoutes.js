import express from "express";
import {
  createWorkPermit,
  getAllWorkPermits,
  getWorkPermitById,
  updateWorkPermit,
  deleteWorkPermit,
} from "../controllers/workPermitController.js";

const router = express.Router();

router.post("/", createWorkPermit);
router.get("/", getAllWorkPermits);
router.get("/:id", getWorkPermitById);
router.put("/:id", updateWorkPermit);
router.delete("/:id", deleteWorkPermit);

export default router;
