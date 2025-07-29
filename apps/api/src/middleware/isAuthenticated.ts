import { Request, Response, NextFunction } from 'express';

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
	if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
	next();
};

export default isAuthenticated;
