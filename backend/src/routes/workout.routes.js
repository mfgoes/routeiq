import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  listExercises,
  listWorkouts,
  createWorkout,
  getWorkout,
  updateWorkout,
  deleteWorkout,
  getLastExerciseWeight,
  listTemplates,
  createTemplate,
  getTemplate,
  deleteTemplate,
} from '../controllers/workout.controller.js';

const router = express.Router();

// All workout endpoints require authentication
router.use(authenticate);

// Exercises (read-only)
router.get('/exercises', listExercises);

// Progressive overload helper
router.get('/exercises/:exerciseId/last-weight', getLastExerciseWeight);

// Templates
router.get('/templates', listTemplates);
router.post('/templates', createTemplate);
router.get('/templates/:id', getTemplate);
router.delete('/templates/:id', deleteTemplate);

// Workouts
router.get('/', listWorkouts);
router.post('/', createWorkout);
router.get('/:id', getWorkout);
router.put('/:id', updateWorkout);
router.delete('/:id', deleteWorkout);

export default router;
