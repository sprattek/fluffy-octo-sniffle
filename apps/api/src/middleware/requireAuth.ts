import { prisma } from '@workspace/database';
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export async function requireAuth(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res
			.status(401)
			.json({ error: 'Missing or invalid Authorization header' });
	}

	const token = authHeader.split(' ')[1];

	if (!token) {
		return res.status(401).json({ error: 'Missing token' });
	}

	try {
		const decoded = jwt.verify(token, process.env.AUTH_SECRET!) as JwtPayload;

		const user = await prisma.user.findUnique({
			where: { id: decoded.userId },
		});

		if (!user) return res.status(401).json({ error: 'User not found' });
		user.password = null;

		req.user = {
			id: user.id,
			email: user.email,
			name: user.name,
		};

		next();
	} catch (err) {
		return res.status(401).json({ error: 'Invalid or expired token' });
	}

	/*if (!token) {
		return res.status(401).json({ error: 'Missing token' });
	}

	try {
		const payload = jwt.verify(token, process.env.AUTH_SECRET!);
		(req as any).user = payload;
		next();
	} catch (err) {
		return res.status(401).json({ error: 'Invalid token' });
	}*/
}
