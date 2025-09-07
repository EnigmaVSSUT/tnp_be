require("dotenv").config();


import express from "express";
import cors from "cors";

//Routes Imports
import authRouter from "./routes/Auth/auth.routes";
import experienceRouter from "./routes/Experience/experience.route";
import documentRouter from "./routes/Document/document.route";
import announcementRoutes from './routes/Announcement/announcement.routes';



//Initialisation
const app = express();



// Middlewares
app.use(cors());
app.use(express.json());


//Routes / APIs
app.get("/",(req,res)=>{
    res.status(200).json({
        message: "Welcome to TNP Backend"
    });
});


app.use("/api/v1/auth",authRouter);
app.use("/api/v1/experience",experienceRouter);
app.use("/api/v1/document",documentRouter);
app.use('/api/v1/announcements', announcementRoutes);




//Listen
app.listen(process.env.PORT || 3000,()=>{
    console.log(`Server is running at http://localhost:${process.env.PORT || 3000}`)
});