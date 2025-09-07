import { Router } from "express";
import { studentAuthValidation } from "../../middlewares/auth/studentAuth.middleware";
import { getStudentProfile } from "../../controller/students/profile.controller";

const router = Router();

router.use(studentAuthValidation)

router.route("/").get(getStudentProfile);

export default router;
