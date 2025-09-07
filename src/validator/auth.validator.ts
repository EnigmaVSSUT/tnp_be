import { z } from "zod";
import { Branches } from "../generated/prisma";

const branchEnum = z.nativeEnum(Branches);

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(16, "Password must not exceed 16 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
      message:
        "Password must include uppercase, lowercase, number, and special character",
    }),
});

export const signupSchema = loginSchema.extend({
  name: z
    .string()
    .min(7, "Name must be at least 7 characters long")
    .max(60, "Name must not exceed 60 characters"),
});

export const studentSignupSchema = z.object({
      name: z.string().min(10).max(60),
      email: z.string().email(),
      regNo: z.string().length(10),
      password: z
        .string()
        .min(8)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
          message:
            "Password must include uppercase, lowercase, number, and special character",
        })
        .max(16),
      profileImg: z.string().url().optional(),
      branch: branchEnum,
      graduationYear: z.number().min(2020).max(2035),
      cgpa: z.number().min(0).max(10),
    });

export const studentLoginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
      message:
        "Password must include uppercase, lowercase, number, and special character",
    })
    .max(47),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type StudentSignupInput = z.infer<typeof studentSignupSchema>;
export type StudentLoginInput = z.infer<typeof studentLoginSchema>;
