import express from "express";
import {
  createJobListing,
  getAllJobs,
  getJobById,
  updateJobListing,
  deleteJobListing,
  filterJobs,
} from "../../controller/JobListing/job.controller";

import { adminAuthValidation } from "../../middlewares/auth/adminAuth.middleware";
import { studentAuthValidation } from "../../middlewares/auth/studentAuth.middleware";


const router = express.Router();
router.post("/", adminAuthValidation, createJobListing);
router.put("/:id", adminAuthValidation, updateJobListing);
router.delete("/:id", adminAuthValidation, deleteJobListing);


router.get("/", studentAuthValidation, getAllJobs);
router.get("/filter", studentAuthValidation, filterJobs);
router.get("/:id", studentAuthValidation, getJobById);

export default router;
