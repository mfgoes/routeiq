import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  listActivities,
  createActivity,
  getActivity,
  updateActivity,
  deleteActivity,
  getActivityStats,
} from '../controllers/activity.controller.js';

const router = express.Router();

// All activity endpoints require authentication
router.use(authenticate);

router.get('/', listActivities);
router.post('/', createActivity);
router.get('/stats', getActivityStats);
router.get('/:id', getActivity);
router.put('/:id', updateActivity);
router.delete('/:id', deleteActivity);

export default router;
