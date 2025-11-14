import express from "express";
import {
  applyForJob,
  updateApplicationStatus,
  getApplicationsByJob,
} from "../../controller/JobListing/application.controller";

import { adminAuthValidation } from "../../middlewares/auth/adminAuth.middleware";
import { studentAuthValidation } from "../../middlewares/auth/studentAuth.middleware";


const router = express.Router();

router.post("/apply", studentAuthValidation, applyForJob);
router.put("/:id/status", adminAuthValidation, updateApplicationStatus);
router.get("/job/:jobId", adminAuthValidation, getApplicationsByJob);

export default router;
