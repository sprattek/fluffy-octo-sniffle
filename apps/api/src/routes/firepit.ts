import express, { Router, Request, Response, NextFunction } from 'express';
import { firepitSchema } from '@workspace/validators'; // Adjust the actual import path
import { prisma } from '@workspace/database'; // Adjust based on how you're exporting Prisma
import isAuthenticated from '../middleware/isAuthenticated';

const router: express.Router = Router();

// GET /api/firepits
router.get('/', async (req: Request, res: Response) => {
	try {
		const firepits = await prisma.firepit.findMany({
			include: { createdBy: true },
		});
		res.json(firepits);
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch firepits' });
	}
});

// GET /api/firepits/:id
router.get('/:id', async (req: Request, res: Response) => {
	try {
		const firepit = await prisma.firepit.findUnique({
			where: { id: req.params.id },
		});
		if (!firepit) return res.status(404).json({ error: 'Not found' });
		res.json(firepit);
	} catch (err) {
		res.status(500).json({ error: 'Error fetching firepit' });
	}
});

// POST /api/firepits
router.post('/', isAuthenticated, async (req: Request, res: Response) => {
	try {
		const userId = req.user!.id;
		const parsed = firepitSchema.safeParse(req.body);
		if (!parsed.success) {
			return res.status(400).json({ error: parsed.error.flatten() });
		}
		const firepit = await prisma.firepit.create({
			data: {
				...parsed.data,
				createdById: userId,
			},
		});
		res.status(201).json(firepit);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Error creating firepit' });
	}
});

// PUT /api/firepits/:id
router.put('/:id', isAuthenticated, async (req: Request, res: Response) => {
	try {
		const userId = req.user!.id;
		const parsed = firepitSchema.safeParse(req.body);
		if (!parsed.success) {
			return res.status(400).json({ error: parsed.error.flatten() });
		}
		const existing = await prisma.firepit.findUnique({
			where: { id: req.params.id },
		});
		if (!existing) return res.status(404).json({ error: 'Not found' });

		// Optional: only allow owner/creator to edit
		if (existing.createdById !== userId) {
			return res.status(403).json({ error: 'Forbidden' });
		}

		const updated = await prisma.firepit.update({
			where: { id: req.params.id },
			data: parsed.data,
		});
		res.json(updated);
	} catch (err) {
		res.status(500).json({ error: 'Error updating firepit' });
	}
});

// DELETE /api/firepits/:id
router.delete('/:id', isAuthenticated, async (req: Request, res: Response) => {
	try {
		const userId = req.user!.id;
		const existing = await prisma.firepit.findUnique({
			where: { id: req.params.id },
		});
		if (!existing) return res.status(404).json({ error: 'Not found' });

		if (existing.createdById !== userId) {
			return res.status(403).json({ error: 'Forbidden' });
		}

		await prisma.firepit.delete({ where: { id: req.params.id } });
		res.status(204).end();
	} catch (err) {
		res.status(500).json({ error: 'Error deleting firepit' });
	}
});

export default router;
