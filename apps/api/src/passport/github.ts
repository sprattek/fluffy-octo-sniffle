import {
	Strategy as GitHubStrategy,
	Profile as GitHubProfile,
} from 'passport-github2';
import passport from 'passport';
import { prisma } from '@workspace/database';

passport.use(
	new GitHubStrategy(
		{
			clientID: process.env.AUTH_GITHUB_ID!,
			clientSecret: process.env.AUTH_GITHUB_SECRET!,
			callbackURL: '/api/auth/github/callback',
		},
		async (
			accessToken: string,
			refreshToken: string,
			profile: GitHubProfile,
			done: (error: any, user?: Express.User | false | null) => void
		) => {
			try {
				const provider = 'github';
				const providerAccountId = profile.id;
				const email = profile.emails?.[0]?.value;

				if (!email) {
					return done(new Error('No email found from GitHub'), null);
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
						name: profile.displayName || profile.username || '',
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
				return done(err as Error, null);
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
