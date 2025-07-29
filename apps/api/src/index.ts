import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import session from 'express-session';
import authRoutes from './routes/auth';
import firepitRoutes from './routes/firepit';
import './auth/passport'; // important!

dotenv.config();

const app = express();

app.use(
	session({
		secret: process.env.AUTH_SESSION_SECRET || 'supersecret',
		resave: false,
		saveUninitialized: false,
		cookie: { secure: false }, // change to `true` if using HTTPS
	})
);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/firepits', firepitRoutes);

app.listen(4000, () => {
	console.log('🚀 Express API running at http://localhost:4000');
});
