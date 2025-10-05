import { Request, Response } from "express";
import { prisma } from "../../prismaClient";

type CompanyData = {
  name: string;
  description: string;
  industry: string;
  website: string;
  contactPerson: string;
  contactEmail: string;
};

// CREATE COMPANY
export const createCompany = async (req: Request, res: Response): Promise<void> => {
  try {
    const data: CompanyData = req.body;
    const newCompany = await prisma.company.create({ data });
    res.status(201).json(newCompany);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create company" });
  }
};

// READ ALL COMPANIES
export const getCompanies = async (_req: Request, res: Response): Promise<void> => {
  try {
    const companies = await prisma.company.findMany({
      include: { jobListings: true }, // ✅ must match Prisma schema field
    });
    res.status(200).json(companies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch companies" });
  }
};

// READ COMPANY BY ID
export const getCompanyById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: "Company ID is required" });
      return;
    }

    const company = await prisma.company.findUnique({
      where: { id },
      include: { jobListings: true }, // ✅ lowercase
    });

    if (!company) {
      res.status(404).json({ error: "Company not found" });
      return;
    }

    res.status(200).json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch company" });
  }
};

// UPDATE COMPANY
export const updateCompany = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const data: Partial<CompanyData> = req.body;

    if (!id) {
      res.status(400).json({ error: "Company ID is required" });
      return;
    }

    const existing = await prisma.company.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: "Company not found" });
      return;
    }

    const updatedCompany = await prisma.company.update({
      where: { id },
      data,
    });

    res.status(200).json(updatedCompany);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update company" });
  }
};

// DELETE COMPANY
export const deleteCompany = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: "Company ID is required" });
      return;
    }

    const existing = await prisma.company.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: "Company not found" });
      return;
    }

    await prisma.company.delete({ where: { id } });
    res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete company" });
  }
};
