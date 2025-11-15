require("dotenv").config();
import express, { Application, Request, Response } from "express";
import cors from "cors";

//Routes Imports
import authRouter from "./routes/Auth/auth.routes";
import experienceRouter from "./routes/Experience/experience.route";
import documentRouter from "./routes/Document/document.route";
import announcementRoutes from './routes/Announcement/announcement.routes';
import profileRoutes from "./routes/students/profile.route";
import companyRouter from "./routes/Compony/compony.routes";
import applicationRouter from "./routes/Admin/application.routes"; // ✅ new
import analyticsRouter from "./routes/Admin/analytics.routes";     // ✅ new
import jobRoutes from "./routes/job/job.routes"; 
import applicationRoutes from "./routes/job/application.routes";

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Welcome to TNP Backend" });
});


// Mount routers
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/experience",experienceRouter);
app.use("/api/v1/document",documentRouter);
app.use('/api/v1/announcements', announcementRoutes);
app.use("/api/v1/student/profile",profileRoutes);
app.use("/api/v1/companies", companyRouter);
app.use("/api/v1/applications", applicationRouter); // ✅ added
app.use("/api/v1/analytics", analyticsRouter);      // ✅ added
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);


// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
const PORT = process.env.PORT ;
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
