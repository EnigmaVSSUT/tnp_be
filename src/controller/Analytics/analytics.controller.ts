import { Request, Response } from "express";
import { prisma } from "../../prismaClient";

// Type for input data
type AnalyticData = {
  jobId: string;
  companyId: string;
  totalApplicants: number;
  shortlisted: number;
  selected: number;
  rejected: number;
};

// CREATE ANALYTIC
export const createAnalytic = async (req: Request, res: Response) => {
  try {
    const { jobId, companyId, totalApplicants, shortlisted, selected, rejected }: AnalyticData = req.body;

    if (!jobId || !companyId) {
      return res.status(400).json({ success: false, message: "jobId and companyId are required" });
    }

    // Check if analytic already exists for the job
    const existing = await prisma.analytic.findFirst({
      where: { jobId },
    });

    if (existing) {
      return res.status(400).json({ success: false, message: "Analytics already exists for this job" });
    }

    const analytic = await prisma.analytic.create({
      data: {
        totalApplicants,
        shortlisted,
        selected,
        rejected,
        jobListing: { connect: { id: jobId } }, // Connect to jobListing
        company: { connect: { id: companyId } }, // Connect to company
      },
    });

    res.status(201).json({ success: true, data: analytic });
  } catch (error) {
    console.error("Error creating analytic:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// READ ALL ANALYTICS
export const getAllAnalytics = async (_req: Request, res: Response) => {
  try {
    const analytics = await prisma.analytic.findMany({
      include: {
        jobListing: { select: { jobTitle: true, companyName: true } },
        company: { select: { name: true, industry: true } },
      },
    });

    res.status(200).json({ success: true, count: analytics.length, data: analytics });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// READ ANALYTIC BY JOB ID
export const getAnalyticByJob = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;

    if (!jobId) {
      return res.status(400).json({ success: false, message: "jobId is required" });
    }

    const analytic = await prisma.analytic.findFirst({
      where: { jobId },
      include: {
        jobListing: { select: { jobTitle: true, companyName: true } },
        company: { select: { name: true, industry: true } },
      },
    });

    if (!analytic) {
      return res.status(404).json({ success: false, message: "Analytics not found" });
    }

    res.status(200).json({ success: true, data: analytic });
  } catch (error) {
    console.error("Error fetching analytic:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// UPDATE ANALYTIC BY JOB ID
export const updateAnalyticByJob = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    const updates = req.body;

    if (!jobId) {
      return res.status(400).json({ success: false, message: "jobId is required" });
    }

    const analytic = await prisma.analytic.update({
      where: { id: (await prisma.analytic.findFirstOrThrow({ where: { jobId } })).id },
      data: updates,
    });

    res.status(200).json({ success: true, data: analytic });
  } catch (error) {
    console.error("Error updating analytic:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// DELETE ANALYTIC BY JOB ID
export const deleteAnalyticByJob = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;

    if (!jobId) {
      return res.status(400).json({ success: false, message: "jobId is required" });
    }

    // Find the analytic first
    const analytic = await prisma.analytic.findFirstOrThrow({ where: { jobId } });

    await prisma.analytic.delete({ where: { id: analytic.id } });

    res.status(200).json({ success: true, message: "Analytics deleted successfully" });
  } catch (error) {
    console.error("Error deleting analytic:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
