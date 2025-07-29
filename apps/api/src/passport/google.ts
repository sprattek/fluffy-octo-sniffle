import {
	Strategy as GoogleStrategy,
	Profile as GoogleProfile,
	VerifyCallback,
} from 'passport-google-oauth20';
import passport from 'passport';
import { prisma } from '@workspace/database';

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.AUTH_GOOGLE_ID!,
			clientSecret: process.env.gRNmND66uqzH5xvceFs7CQsDd2Go!,
			callbackURL: '/api/auth/google/callback',
		},
		async (
			accessToken: string,
			refreshToken: string,
			profile: GoogleProfile,
			done: VerifyCallback
		) => {
			try {
				const provider = 'google';
				const providerAccountId = profile.id;
				const email = profile.emails?.[0]?.value;

				if (!email) {
					return done(new Error('No email found from Google'), undefined);
				}

				const existingAccount = await prisma.account.findUnique({
					where: {
						provider_providerAccountId: {
							provider,
							providerAccountId,
						},
					},
					include: { user: true },
				});

				if (existingAccount) return done(null, existingAccount.user);

				const newUser = await prisma.user.create({
					data: {
						name: profile.displayName || '',
						email,
						image: profile.photos?.[0]?.value || '',
						accounts: {
							create: {
								provider,
								providerAccountId,
								type: 'oauth',
								access_token: accessToken,
							},
						},
					},
				});

				return done(null, newUser);
			} catch (err) {
				return done(err as Error, undefined);
			}
		}
	)
);

// Required for persistent login sessions (can be no-op if using JWT)
passport.serializeUser((user: any, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
	try {
		const user = await prisma.user.findUnique({ where: { id } });
		done(null, user);
	} catch (err) {
		done(err);
	}
});
