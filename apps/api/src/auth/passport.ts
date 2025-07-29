import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import { prisma } from '@workspace/database';

passport.use(
	new LocalStrategy(
		{ usernameField: 'email' }, // Expecting email instead of "username"
		async (email, password, done) => {
			try {
				const user = await prisma.user.findUnique({ where: { email } });
				if (!user || !user.password) {
					return done(null, false, { message: 'Invalid credentials' });
				}

				const isValid = await bcrypt.compare(password, user.password);
				if (!isValid) {
					return done(null, false, { message: 'Invalid credentials' });
				}

				return done(null, user);
			} catch (error) {
				return done(error);
			}
		}
	)
);
