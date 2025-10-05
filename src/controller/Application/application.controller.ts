import { Request, Response } from "express";
import { prisma } from "../../prismaClient";

// ✅ Get all applications
export const getAllApplications = async (_req: Request, res: Response) => {
  try {
    const apps = await prisma.application.findMany({
      include: {
        student: { select: { id: true, name: true, email: true, regNo: true } },
        jobListing: { select: { id: true, jobTitle: true, companyName: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(apps);
  } catch (err) {
    console.error("Error in getAllApplications:", err);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
};

// ✅ Get applications by Job ID
export const getApplicationsByJob = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;

    if (!jobId) {
      return res.status(400).json({ error: "Missing jobId" });
    }

    // Ensure job exists
    const job = await prisma.jobListing.findUnique({ where: { id: jobId } });
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    const apps = await prisma.application.findMany({
      where: { jobId },
      include: {
        student: { select: { id: true, name: true, email: true, regNo: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(apps);
  } catch (err) {
    console.error("Error in getApplicationsByJob:", err);
    res.status(500).json({ error: "Failed to fetch applications for job" });
  }
};

// ✅ Update application status
export const patchApplicationStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Missing application id" });
    }
    if (!status) {
      return res.status(400).json({ error: "Missing status" });
    }

    // Ensure application exists
    const existing = await prisma.application.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Application not found" });
    }

    const updated = await prisma.application.update({
      where: { id },
      data: { status },
    });

    res.json(updated);
  } catch (err) {
    console.error("Error in patchApplicationStatus:", err);
    res.status(500).json({ error: "Failed to update application status" });
  }
};

// ✅ Create new application
export const createApplication = async (req: Request, res: Response) => {
  try {
    const { studentId, jobId, status } = req.body;

    if (!studentId || !jobId || !status) {
      return res.status(400).json({
        error: "Missing required fields: studentId, jobId, status",
      });
    }

    // Ensure student exists
    const student = await prisma.student.findUnique({ where: { id: studentId } });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Ensure job exists
    const job = await prisma.jobListing.findUnique({ where: { id: jobId } });
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Create application
    const app = await prisma.application.create({
      data: { studentId, jobId, status },
    });

    res.status(201).json(app);
  } catch (err) {
    console.error("Error in createApplication:", err);
    res.status(500).json({ error: "Failed to create application" });
  }
};
