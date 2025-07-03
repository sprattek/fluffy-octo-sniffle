import NextAuth, { NextAuthResult } from 'next-auth';
import { NextResponse } from 'next/server';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@workspace/database';
import Credentials from 'next-auth/providers/credentials';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import { signInSchema } from './lib/zod';
import Resend from 'next-auth/providers/resend';

const nextAuth = NextAuth({
	adapter: PrismaAdapter(prisma),
	providers: [
		Credentials({
			credentials: {
				email: {
					type: 'email',
					label: 'Email',
					placeholder: 'johndoe@gmail.com',
					required: true,
					minLength: 3,
				},
				password: {
					type: 'password',
					label: 'Password',
					placeholder: '*****',
					required: true,
					minLength: 8,
					maxLength: 32,
				},
			},
			authorize: async (credentials) => {
				try {
					const { email } = await signInSchema.parseAsync(credentials);

					const user = await prisma.user.findUnique({
						where: { email },
					});

					return user;
				} catch (error) {
					console.log(error);
					return null;
				}
			},
		}),
		GitHub,
		Google,
		Resend({
			apiKey: process.env.AUTH_RESEND_KEY,
			from: 'noreply@info.tattek.sk',
		}),
	],
	session: { strategy: 'jwt' },
	callbacks: {
		authorized({ request, auth }) {
			const publicRoutes = ['/login', '/', '/register', '/forgot-password'];
			const { pathname } = request.nextUrl;
			if (!publicRoutes.includes(pathname) && !auth) {
				return NextResponse.redirect(new URL('/login', request.url));
			}
			return true;
		},
		jwt({ token, trigger, session }) {
			if (trigger === 'update') token.name = session?.user?.name;
			return token;
		},
	},
	secret: process.env.AUTH_SECRET,
});

export const handlers: NextAuthResult['handlers'] = nextAuth.handlers;
export const signIn: NextAuthResult['signIn'] = nextAuth.signIn;
export const signOut: NextAuthResult['signOut'] = nextAuth.signOut;
export const auth: NextAuthResult['auth'] = nextAuth.auth;
