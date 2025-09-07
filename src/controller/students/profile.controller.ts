import ApiError from "../../utils/Handlers/apiError";
import { asyncHandler } from "../../utils/Handlers/asyncHandler";
import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";
import ApiResponse from "../../utils/Handlers/apiResponse";
const prisma = new PrismaClient();

export const getStudentProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const email = req.user?.email;

    if (!email?.trim()) {
      return res.status(400).json(
        ApiError.badRequest("Email is required", 400)
      );
    }

    const studentDetails = await prisma.student.findUnique({
      where: { email },
      include: {
        experiences: true,
      },
      omit:{
        id: true,
        password: true,
      }
    });

    if (!studentDetails) {
      return res.status(404).json(
        ApiError.notFound("No student found", 404)
      );
    }

    return res.status(200).json(
      ApiResponse.success(
        studentDetails, {}, 200
      )
    );
  }
);

