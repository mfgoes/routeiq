import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  listExercises,
  listWorkouts,
  createWorkout,
  getWorkout,
  updateWorkout,
  deleteWorkout,
} from '../controllers/workout.controller.js';

const router = express.Router();

// All workout endpoints require authentication
router.use(authenticate);

// Exercises (read-only)
router.get('/exercises', listExercises);

// Workouts
router.get('/', listWorkouts);
router.post('/', createWorkout);
router.get('/:id', getWorkout);
router.put('/:id', updateWorkout);
router.delete('/:id', deleteWorkout);

export default router;
