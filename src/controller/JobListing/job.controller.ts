import { Request, Response } from "express";
import { Prisma, PrismaClient, $Enums } from "../../generated/prisma";


const prisma = new PrismaClient();

export const createJobListing = async (req: Request, res: Response) => {
  try {
    const {
      companyId,
      companyName,
      jobTitle,
      jobType,
      description,
      testLink,
      status,
      eligibility
    } = req.body;

    const createdEligibility = await prisma.jobEligibility.create({
      data: {
        branches: eligibility.branches || [],
        graduationYears: eligibility.graduationYears || [],
        minCgpa: eligibility.minCgpa || null
      },
    });

    const job = await prisma.jobListing.create({
      data: {
        companyId,
        companyName,
        jobTitle,
        jobType,
        description,
        testLink,
        status,
        eligibilityId: createdEligibility.id,
      },
      include: { eligibility: true }
    });

    res.status(201).json({ message: "Job created successfully", job });
  } catch (error: any) {
    console.error("Error creating job:", error);
    res.status(500).json({ error: error.message });
  }
};

//getr all jobs
export const getAllJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await prisma.jobListing.findMany({
      include: { eligibility: true, company: true }
    });
    res.json(jobs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

//Job by id
export const getJobById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Job id is required" });
    const job = await prisma.jobListing.findFirst({
      where: { id },
      include: { eligibility: true, company: true },
    });

    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

//Updaet a job
export const updateJobListing = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Job id is required" });

    const { companyName, jobTitle, jobType, description, status, testLink } = req.body;
    const result = await prisma.jobListing.updateMany({
      where: { id },
      data: { companyName, jobTitle, jobType, description, status, testLink },
    });

    if (result.count === 0) return res.status(404).json({ message: "Job not found" });

    const updated = await prisma.jobListing.findFirst({
      where: { id },
      include: { eligibility: true, company: true },
    });

    res.json({ message: "Job updated successfully", updated });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

//Delete a job
export const deleteJobListing = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Job id is required" });
    const result = await prisma.jobListing.deleteMany({ where: { id } });
    if (result.count === 0) return res.status(404).json({ message: "Job not found" });

    res.json({ message: "Job deleted successfully", deletedCount: result.count });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

//Filter Jobs
export const filterJobs = async (req: Request, res: Response) => {
  try {
    const { branch, cgpa, graduationYear } = req.query;
    const validBranches = Object.values($Enums.Branches);
    if (branch && !validBranches.includes(branch as any)) {
      return res.status(400).json({ message: "Invalid branch value" });
    }

    const jobs = await prisma.jobListing.findMany({
      where: {
        eligibility: {
          AND: [
            branch ? { branches: { has: branch as $Enums.Branches } } : {},
            graduationYear ? { graduationYears: { has: Number(graduationYear) } } : {},
            {
              OR: [
                { minCgpa: { lte: Number(cgpa) } },
                { minCgpa: null }
              ]
            }
          ]
        },
        status: "OPEN"
      },
      include: { eligibility: true, company: true }
    });

    res.json(jobs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
