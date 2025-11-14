import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

//apply job(student)
export const applyForJob = async (req: Request, res: Response) => {
  try {
    const { studentId, jobId } = req.body;

    const existingApp = await prisma.application.findFirst({
      where: { studentId, jobId },
    });

    if (existingApp)
      return res.status(400).json({ message: "Already applied to this job" });

    const newApp = await prisma.application.create({
      data: {
        studentId,
        jobId,
        status: "APPLIED",
      },
    });

    res.status(201).json({ message: "Application submitted", application: newApp });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

//update application status
export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Validate id is provided
    if (!id) {
      return res.status(400).json({ message: "Application ID is required" });
    }

    const { status } = req.body; 

    const validStatuses = ["APPLIED", "SHORTLISTED", "TEST", "INTERVIEW", "ACCEPTED", "REJECTED"];
    if (!validStatuses.includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const updatedApp = await prisma.application.update({
      where: { id },
      data: { status },
    });

    res.json({ message: "Status updated", application: updatedApp });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

//get all applications for a specific job
export const getApplicationsByJob = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    
    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    const applications = await prisma.application.findMany({
      where: { jobId },
      include: { student: true },
    });

    res.json(applications);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};