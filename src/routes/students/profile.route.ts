import { Router } from "express";
import { studentAuthValidation } from "../../middlewares/auth/studentAuth.middleware";
import { getStudentProfile, updateStudentProfile } from "../../controller/students/profile.controller";

const router = Router();

router.use(studentAuthValidation)

router.route("/").get(getStudentProfile);
router.route("/update").put(updateStudentProfile);

export default router;
