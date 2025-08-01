import { Request, Response } from 'express';
import { firepitSchema } from '@workspace/validators'; // Adjust the actual import path
import { prisma } from '@workspace/database'; // Adjust based on how you're exporting Prisma
import updateFirepitLocation from '../utils/updateFirepitLocation';

const getFirepits = async (req: Request, res: Response) => {
	try {
		const firepits = await prisma.firepit.findMany({
			include: { createdBy: true },
		});
		res.json(firepits);
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch firepits' });
	}
};

const getFirepit = async (req: Request, res: Response) => {
	try {
		const firepit = await prisma.firepit.findUnique({
			where: { id: req.params.id },
		});
		if (!firepit) return res.status(404).json({ error: 'Not found' });
		res.json(firepit);
	} catch (err) {
		res.status(500).json({ error: 'Error fetching firepit' });
	}
};

const createFirepit = async (req: Request, res: Response) => {
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
		await updateFirepitLocation(
			firepit.id,
			parsed.data.longitude,
			parsed.data.latitude
		);
		res.status(201).json(firepit);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Error creating firepit' });
	}
};

const updateFirepit = async (req: Request, res: Response) => {
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

		await updateFirepitLocation(
			req.params.id!,
			parsed.data.longitude,
			parsed.data.latitude
		);

		res.json(updated);
	} catch (err) {
		res.status(500).json({ error: 'Error updating firepit' });
	}
};

const deleteFirepit = async (req: Request, res: Response) => {
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
};

export { getFirepits, getFirepit, createFirepit, updateFirepit, deleteFirepit };
