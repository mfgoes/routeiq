import express from 'express';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import {
  listRoutes,
  createRoute,
  getRoute,
  updateRoute,
  deleteRoute,
  browsePublicRoutes,
} from '../controllers/route.controller.js';

const router = express.Router();

// Public routes
router.get('/public', browsePublicRoutes);

// Protected routes
router.use(authenticate);

router.get('/', listRoutes);
router.post('/', createRoute);
router.get('/:id', getRoute);
router.put('/:id', updateRoute);
router.delete('/:id', deleteRoute);

export default router;
