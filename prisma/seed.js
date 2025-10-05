"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// prisma/seed.ts
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = require("../src/generated/prisma"); // generator output path
const prisma = new prisma_1.PrismaClient();
async function main() {
    // Admin (if you need one)
    const adminPwd = await bcrypt_1.default.hash("admin@123", 10);
    await prisma.admin.upsert({
        where: { email: "admin@tnp.com" },
        update: {},
        create: { name: "TNP Admin", email: "admin@tnp.com", password: adminPwd }
    });
    // Companies
    const acme = await prisma.company.create({
        data: {
            name: "Acme Corp",
            description: "Sample software firm",
            industry: "Software",
            website: "https://acme.example",
            contactPerson: "Alice",
            contactEmail: "hr@acme.example"
        }
    });
    const megacorp = await prisma.company.create({
        data: {
            name: "Megacorp",
            description: "Sample enterprise",
            industry: "Finance",
            website: "https://megacorp.example",
            contactPerson: "Bob",
            contactEmail: "hr@megacorp.example"
        }
    });
    // Job listing connected to company
    const job = await prisma.jobListing.create({
        data: {
            companyId: acme.id,
            companyName: acme.name,
            jobTitle: "Backend Intern",
            jobType: "INTERNSHIP",
            description: "6 month backend internship",
            eligibility: { branches: ["CSE", "IT"], graduationYears: [2025, 2026], minCgpa: 7.0 },
            status: "OPEN"
        } // Prisma + Mongo types may need a cast
    });
    // Student + application
    const student = await prisma.student.create({
        data: {
            name: "Test Student",
            regNo: "REG2025001",
            email: "student1@example.com",
            password: "dont-use-in-prod",
            branch: "CSE",
            graduationYear: 2026,
            cgpa: 8.2,
            profileCompleted: true
        }
    });
    await prisma.application.create({
        data: {
            studentId: student.id,
            jobId: job.id,
            status: "APPLIED"
        }
    });
    console.log("Seed complete");
}
main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
//# sourceMappingURL=seed.js.map