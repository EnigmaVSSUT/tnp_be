import { Router } from "express";
import {
  createAnalytic,
  getAnalyticByJob,
  updateAnalyticByJob,
  deleteAnalyticByJob,
  getAllAnalytics,
} from "../../controller/Analytics/analytics.controller";

const router = Router();

// Analytics CRUD
router.post("/", createAnalytic);                  // Create analytics
router.get("/", getAllAnalytics);                  // Get all analytics (admin)
router.get("/:jobId", getAnalyticByJob);           // Get analytics by job
router.put("/:jobId", updateAnalyticByJob);        // Update analytics by job
router.delete("/:jobId", deleteAnalyticByJob);     // Delete analytics by job

export default router;
