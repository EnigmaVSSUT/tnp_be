import { Router } from "express";
import {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
} from "../../controller/Compony/compony.controller";

const router = Router();

// CRUD routes
router.post("/", createCompany);        // Create
router.get("/", getCompanies);          // Read all
router.get("/:id", getCompanyById);     // Read one
router.put("/:id", updateCompany);      // Update
router.delete("/:id", deleteCompany);   // Delete

export default router;
