import express from 'express';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All route endpoints require authentication
router.use(authenticate);

// Placeholder routes (to be implemented)
router.get('/', (req, res) => {
  res.json({ message: 'List routes - TODO' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create route - TODO' });
});

router.get('/:id', (req, res) => {
  res.json({ message: `Get route ${req.params.id} - TODO` });
});

router.put('/:id', (req, res) => {
  res.json({ message: `Update route ${req.params.id} - TODO` });
});

router.delete('/:id', (req, res) => {
  res.json({ message: `Delete route ${req.params.id} - TODO` });
});

export default router;
