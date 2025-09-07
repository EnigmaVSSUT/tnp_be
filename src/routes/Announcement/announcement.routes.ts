import { Router } from 'express';
import {
  createAnnouncement,
  getAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
} from '../../controller/Announcement/announcement.controller';

import {
  adminAuthValidation,
} from '../../middlewares/auth/adminAuth.middleware'; 

const router = Router();

// Setup the routes for the base '/' endpoint.
// GET is for any authenticated user (students, admins).
// POST is only for users who pass admin validation.
router
  .route('/')
  .get(adminAuthValidation, getAnnouncements)
  .post(adminAuthValidation, createAnnouncement);

// Setup the routes for accessing a specific announcement by its ID.
// Both PATCH (update) and DELETE are restricted to admins.
router
  .route('/:id')
  .patch(adminAuthValidation, updateAnnouncement)
  .delete(adminAuthValidation, deleteAnnouncement);

export default router;

