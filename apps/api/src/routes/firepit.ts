import express, { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth';
import {
	createFirepit,
	deleteFirepit,
	getFirepit,
	getFirepits,
	updateFirepit,
} from '../controllers/firepit';

const router: express.Router = Router();

// GET /firepits
router.get('/', getFirepits);

// GET /firepits/:id
router.get('/:id', getFirepit);

// POST /firepits
router.post('/', requireAuth, createFirepit);

// PUT /firepits/:id
router.put('/:id', requireAuth, updateFirepit);

// DELETE /firepits/:id
router.delete('/:id', requireAuth, deleteFirepit);

export default router;
