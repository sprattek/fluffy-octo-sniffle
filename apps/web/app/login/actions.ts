'use server';

import bcrypt, { compare } from 'bcryptjs';
import { prisma } from '@workspace/database';
import { signIn } from '@/auth';
import { signInSchema } from '@/lib/zod';
import { redirect } from 'next/navigation';

type ActionResult = { success: true } | { success: false; error: string };

export async function logIn(formData: FormData): Promise<ActionResult> {
	const rawData = {
		email: formData.get('email'),
		password: formData.get('password'),
	};

	const parsed = signInSchema.safeParse(rawData);

	if (!parsed.success) {
		const errors = parsed.error.flatten().fieldErrors;
		return {
			success: false,
			error: Object.values(errors).flat().join(', ') || 'Invalid input',
		};
	}

	const { email, password } = parsed.data;

	try {
		// 🔎 Check if user already exists
		const existingUser = await prisma.user.findUnique({ where: { email } });

		if (!existingUser || !existingUser.password) {
			return { success: false, error: 'Invalid credentials' };
		}

		const isValid = await compare(password, existingUser.password);
		if (!isValid) {
			return { success: false, error: 'Invalid credentials' };
		}

		// ✅ Auto-sign in the user
		await signIn('credentials', {
			email,
			password,
		});

		return {
			success: true,
		};
	} catch (err: any) {
		if (err?.digest?.startsWith('NEXT_REDIRECT')) {
			redirect('/');
		} else {
			console.error('[SIGN_UP_ERROR]', err);
			return {
				success: false,
				error: 'Something went wrong. Please try again later.',
			};
		}
	}
}
