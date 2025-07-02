export const runtime = 'nodejs';

import NextAuth, { NextAuthResult } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@workspace/database';
import Credentials from 'next-auth/providers/credentials';
import GitHub from 'next-auth/providers/github';
import { NextResponse } from 'next/server';

const nextAuth = NextAuth({
	adapter: PrismaAdapter(prisma),
	providers: [Credentials, GitHub],
	session: { strategy: 'jwt' },
	callbacks: {
		authorized({ request, auth }) {
			const publicRoutes = ['/login', '/', '/register', '/about'];
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
});

export const handlers: NextAuthResult['handlers'] = nextAuth.handlers;
export const signIn: NextAuthResult['signIn'] = nextAuth.signIn;
export const signOut: NextAuthResult['signOut'] = nextAuth.signOut;
export const auth: NextAuthResult['auth'] = nextAuth.auth;
