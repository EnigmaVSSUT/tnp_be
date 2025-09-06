import { Request, Response, NextFunction } from 'express';
// Make sure to import your prisma client and generated types
import prisma from '../../cofig/db.config'; // Corrected Path and Typo
import { AudienceType, Branches } from '../../generated/prisma'; // Corrected Path

/**
 * @desc Create a new announcement (Admin only)
 * @route POST /api/v1/announcements
 */
export const createAnnouncement = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, audience, filterData } = req.body;
    const adminId = (req as any).user.id; // From your isAdmin middleware

    if (!title || !description || !audience) {
      return res.status(400).json({ error: 'Title, description, and audience are required.' });
    }

    const newAnnouncement = await prisma.announcement.create({
      data: {
        title,
        description,
        audience, // e.g., 'ALL', 'BRANCH', 'BATCH'
        filterData, // e.g., { branches: ['CSE'], graduationYears: [2025] }
        createdBy: adminId, // Link to the admin who created it
      },
    });

    res.status(201).json({ message: 'Announcement created successfully', data: newAnnouncement });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get all relevant announcements for the logged-in user
 * @route GET /api/v1/announcements
 */
export const getAnnouncements = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user; // Assuming middleware attaches student/admin details

    // If the user is an admin, they can see all announcements
    if (user.role === 'admin') {
      const allAnnouncements = await prisma.announcement.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return res.status(200).json({ data: allAnnouncements });
    }

    // For students, filter announcements based on their profile
    const studentBranch = user.branch;
    const studentGraduationYear = user.graduationYear;

    // Fetch all announcements that could potentially be for the user
    const potentialAnnouncements = await prisma.announcement.findMany({
      where: {
        audience: {
          in: ['ALL', 'BRANCH', 'BATCH'],
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Since advanced JSON filtering isn't supported, we filter in the application.
    const announcements = potentialAnnouncements.filter(ann => {
      if (ann.audience === 'ALL') {
        return true;
      }
      if (ann.audience === 'BRANCH') {
        // Ensure filterData and its properties exist before checking
        const branches = (ann.filterData as any)?.branches;
        return Array.isArray(branches) && branches.includes(studentBranch);
      }
      if (ann.audience === 'BATCH') {
        // Ensure filterData and its properties exist before checking
        const years = (ann.filterData as any)?.graduationYears;
        return Array.isArray(years) && years.includes(studentGraduationYear);
      }
      return false;
    });

    res.status(200).json({ data: announcements });
  } catch (error) {
    next(error);
  }
};

