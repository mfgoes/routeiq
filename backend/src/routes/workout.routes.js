import express from 'express';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All workout endpoints require authentication
router.use(authenticate);

// Exercises (read-only for now)
router.get('/exercises', (req, res) => {
  res.json({ message: 'List exercises - TODO' });
});

// Workouts
router.get('/', (req, res) => {
  res.json({ message: 'List workouts - TODO' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create workout - TODO' });
});

router.get('/:id', (req, res) => {
  res.json({ message: `Get workout ${req.params.id} - TODO` });
});

router.put('/:id', (req, res) => {
  res.json({ message: `Update workout ${req.params.id} - TODO` });
});

router.delete('/:id', (req, res) => {
  res.json({ message: `Delete workout ${req.params.id} - TODO` });
});

export default router;
