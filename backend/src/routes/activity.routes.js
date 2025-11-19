import express from 'express';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All activity endpoints require authentication
router.use(authenticate);

// Placeholder routes (to be implemented)
router.get('/', (req, res) => {
  res.json({ message: 'List activities - TODO' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create activity - TODO' });
});

router.get('/stats', (req, res) => {
  res.json({ message: 'Get activity stats - TODO' });
});

router.get('/:id', (req, res) => {
  res.json({ message: `Get activity ${req.params.id} - TODO` });
});

router.put('/:id', (req, res) => {
  res.json({ message: `Update activity ${req.params.id} - TODO` });
});

router.delete('/:id', (req, res) => {
  res.json({ message: `Delete activity ${req.params.id} - TODO` });
});

export default router;
