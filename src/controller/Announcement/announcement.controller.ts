import { Request, Response, NextFunction } from 'express';
import prisma from '../../cofig/db.config';


/**
 * @desc Create a new announcement (Admin only)
 * @route POST /api/v1/announcements
 */
export const createAnnouncement = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, audience, filterData } = req.body;
    
    // Safely access user from request
    const user = (req as any).user;
    if (!user || !user.id) {
        return res.status(401).json({ message: "Authentication error: Admin ID not found." });
    }
    const adminId = user.id;

    if (!title || !description || !audience) {
      return res.status(400).json({ error: 'Title, description, and audience are required.' });
    }

    const newAnnouncement = await prisma.announcement.create({
      data: {
        title,
        description,
        audience, // e.g., 'ALL', 'BRANCH', 'BATCH'
        filterData: filterData || {}, // e.g., { branches: ['CSE'], graduationYears: [2025] }
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
    const user = (req as any).user;

    //a check to ensure the user object exists.
    if (!user) {
      return res.status(401).json({ message: "Authentication error: User information not found on request." });
    }

    // If the user is an admin, they can see all announcements
    // Check for 'ADMIN' (uppercase) to match JWT payload
    if (user.role === 'ADMIN') {
      const allAnnouncements = await prisma.announcement.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return res.status(200).json({ data: allAnnouncements });
    }

    // For students, filter announcements based on their profile
    const studentBranch = user.branch;
    const studentGraduationYear = user.graduationYear;

    // Fetch all announcements that are not for a specific audience
    const relevantAnnouncements = await prisma.announcement.findMany({
        where: {
            audience: {
                in: ['ALL', 'BRANCH', 'BATCH']
            }
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    // Filter in memory to support all databases
    // Remove the explicit type. TypeScript will infer it correctly.
    const filteredAnnouncements = relevantAnnouncements.filter((ann) => {
        if (ann.audience === 'ALL') {
            return true;
        }
        if (ann.audience === 'BRANCH') {
            // Since `filterData` can be null, we need to handle that possibility
            const filterBranches = (ann.filterData as any)?.branches || [];
            return filterBranches.includes(studentBranch);
        }
        if (ann.audience === 'BATCH') {
            const filterYears = (ann.filterData as any)?.graduationYears || [];
            return filterYears.includes(studentGraduationYear);
        }
        return false;
    });


    res.status(200).json({ data: filteredAnnouncements });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Update an announcement (Admin only)
 * @route PATCH /api/v1/announcements/:id
 */
export const updateAnnouncement = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { title, description, audience, filterData } = req.body;

        // Add validation to ensure 'id' is a string
        if (!id) {
            return res.status(400).json({ message: "Announcement ID is required." });
        }

        const updatedAnnouncement = await prisma.announcement.update({
            where: { id },
            data: {
                title,
                description,
                audience,
                filterData: filterData || undefined,
            },
        });

        res.status(200).json({ message: "Announcement updated successfully", data: updatedAnnouncement });

    } catch (error) {
        next(error);
    }
};

/**
 * @desc Delete an announcement (Admin only)
 * @route DELETE /api/v1/announcements/:id
 */
export const deleteAnnouncement = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        // Add validation to ensure 'id' is a string
        if (!id) {
            return res.status(400).json({ message: "Announcement ID is required." });
        }
        
        await prisma.announcement.delete({
            where: { id },
        });

        res.status(200).json({ message: 'Announcement deleted successfully' });
    } catch (error) {
        next(error);
    }
};

