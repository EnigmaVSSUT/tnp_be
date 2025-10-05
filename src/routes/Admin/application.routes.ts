import { Router } from "express";
import { getAllApplications, getApplicationsByJob, patchApplicationStatus, createApplication } from "../../controller/Application/application.controller";
const router = Router();
router.get("/", getAllApplications);
router.get("/job/:jobId", getApplicationsByJob);
router.post("/", createApplication);
router.patch("/:id/status", patchApplicationStatus);
export default router;
