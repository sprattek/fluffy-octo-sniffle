import express, { Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import '../passport/github';
import '../passport/google';
import { requireAuth } from '../middleware/requireAuth';
import {
	forgotPasswordHandler,
	loginHandler,
	passwordResetHandler,
	registerHandler,
} from '../controllers/auth';

const router: express.Router = Router();

router.post('/login', loginHandler);
router.post('/register', registerHandler);
router.post('/forgot-password', forgotPasswordHandler);
router.post('/reset-password', passwordResetHandler);

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
