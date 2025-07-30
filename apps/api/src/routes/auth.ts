import express, { Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { registerSchema } from '@workspace/validators';
import { prisma } from '@workspace/database';
import '../passport/github';
import '../passport/google';
import { sendResetEmail } from '../lib/email';
import { requireAuth } from '../middleware/requireAuth';

const router: express.Router = Router();

router.post('/login', (req: Request, res: Response, next: NextFunction) => {
	passport.authenticate(
		'local',
		{ session: false },
		(
			err: any,
			user: { id: string; email: string; name: string } | false,
			info: { message: string }
		) => {
			if (err || !user) {
				return res.status(401).json({ error: info?.message || 'Login failed' });
			}

			const token = jwt.sign(
				{ userId: user.id, email: user.email },
				process.env.AUTH_SECRET!,
				{ expiresIn: '7d' }
			);

			return res.json({
				token,
				user: {
					id: user.id,
					email: user.email,
					name: user.name,
				},
			});
		}
	)(req, res, next);
});

router.post('/register', async (req: Request, res: Response) => {
	const parsed = registerSchema.safeParse(req.body);

	if (!parsed.success) {
		return res.status(400).json({ error: parsed.error.flatten() });
	}

	const { name, email, password } = parsed.data;

	try {
		const existingUser = await prisma.user.findUnique({ where: { email } });
		if (existingUser) {
			return res.status(409).json({ error: 'User already exists' });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
			},
		});

		const token = jwt.sign(
			{ userId: user.id, email: user.email },
			process.env.AUTH_SECRET!,
			{ expiresIn: '7d' }
		);

		return res.status(201).json({
			message: 'User registered successfully',
			token,
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
			},
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Server error' });
	}
});

router.post('/forgot-password', async (req: Request, res: Response) => {
	const { email } = req.body;

	const user = await prisma.user.findUnique({ where: { email } });
	if (!user) return res.status(404).json({ error: 'User not found' });

	const token = crypto.randomBytes(32).toString('hex');
	const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

	await prisma.verificationToken.create({
		data: {
			identifier: email,
			token,
			expires,
		},
	});

	await sendResetEmail(email, token);

	res.json({ message: 'Password reset email sent' });
});

router.post('/reset-password', async (req: Request, res: Response) => {
	const { token, email } = req.body;

	const verification = await prisma.verificationToken.findUnique({
		where: {
			identifier_token: {
				identifier: email,
				token,
			},
		},
	});

	if (!verification || verification.expires < new Date()) {
		return res.status(400).json({ error: 'Invalid or expired token' });
	}

	const user = await prisma.user.findUnique({
		where: { email: verification.identifier },
	});

	if (!user) {
		return res.status(404).json({ error: 'User not found' });
	}

	const userToken = jwt.sign(
		{ userId: user.id, email: user.email },
		process.env.AUTH_SECRET!,
		{ expiresIn: '7d' }
	);

	if (!user.emailVerified) {
		await prisma.user.update({
			where: { id: user.id },
			data: { emailVerified: new Date() },
		});
	}

	await prisma.verificationToken.delete({
		where: {
			identifier_token: {
				identifier: email,
				token,
			},
		},
	});

	return res.json({
		token: userToken,
		user: {
			id: user.id,
			email: user.email,
			name: user.name,
		},
	});
});

// GET /auth/me - Get current user
router.get('/me', requireAuth, (req: Request, res: Response) => {
	res.json({ user: req.user });
});

// --- GitHub OAuth routes ---

// Redirect to GitHub for authentication
router.get(
	'/github',
	passport.authenticate('github', { scope: ['user:email'] })
);

// GitHub OAuth callback
router.get(
	'/github/callback',
	passport.authenticate('github', {
		failureRedirect: '/login',
		session: false,
	}),
	(req: Request, res: Response) => {
		// 🎯 Success — return JWT or redirect with token
		const token = jwt.sign(
			{ userId: req.user?.id, email: req.user?.email },
			process.env.AUTH_SECRET!,
			{ expiresIn: '7d' }
		);

		// Redirect to frontend with token
		res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
	}
);

// --- Google OAuth routes ---

// Redirect to Google login
router.get(
	'/google',
	passport.authenticate('google', {
		scope: ['profile', 'email'],
	})
);

// Handle callback from Google
router.get(
	'/google/callback',
	passport.authenticate('google', {
		failureRedirect: '/login',
		session: false, // ⚠️ disable session unless you're using it
	}),
	(req: Request, res: Response) => {
		// 🎯 Success — return JWT or redirect with token
		const token = jwt.sign(
			{ userId: req.user?.id, email: req.user?.email },
			process.env.AUTH_SECRET!,
			{ expiresIn: '7d' }
		);

		// Redirect to frontend with token
		res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
	}
);

export default router;
