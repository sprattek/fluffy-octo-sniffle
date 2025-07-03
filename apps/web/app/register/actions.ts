'use server';

import bcrypt from 'bcryptjs';
import { prisma } from '@workspace/database';
import { signIn } from '@/auth';
import { signUpSchema } from '@/lib/zod';
import { redirect } from 'next/navigation';

type ActionResult = { success: true } | { success: false; error: string };

export async function signUp(formData: FormData): Promise<ActionResult> {
	const rawData = {
		name: formData.get('name'),
		email: formData.get('email'),
		password: formData.get('password'),
		passwordConfirm: formData.get('passwordConfirm'),
	};

	const parsed = signUpSchema.safeParse(rawData);

	if (!parsed.success) {
		const errors = parsed.error.flatten().fieldErrors;
		return {
			success: false,
			error: Object.values(errors).flat().join(', ') || 'Invalid input',
		};
	}

	const { name, email, password } = parsed.data;

	try {
		// 🔎 Check if user already exists
		const existingUser = await prisma.user.findUnique({ where: { email } });
		if (existingUser) {
			return { success: false, error: 'Email already in use' };
		}

		// 🔐 Hash password and store user
		const hashedPassword = await bcrypt.hash(password, 10);
		await prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
			},
		});

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
