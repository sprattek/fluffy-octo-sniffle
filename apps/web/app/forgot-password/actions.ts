'use server';

import { signIn } from '@/auth';
import { prisma } from '@workspace/database';
import { redirect } from 'next/navigation';

type ActionResult = { success: true } | { success: false; error: string };

export async function resetPassword(formData: FormData): Promise<ActionResult> {
	const email = formData.get('email') as string;

	try {
		// 🔎 Check if user already exists
		const existingUser = await prisma.user.findUnique({ where: { email } });

		if (!existingUser || !existingUser.password) {
			return { success: false, error: 'Invalid credentials' };
		}

		await signIn('resend', { email });

		return {
			success: true,
		};
	} catch (err: any) {
		if (err?.digest?.startsWith('NEXT_REDIRECT')) {
			redirect('/login');
		} else {
			console.error('[PASSWORD_RESET_ERROR]', err);
			return {
				success: false,
				error: 'Something went wrong. Please try again later.',
			};
		}
	}
}

export async function updatePassword(token: string, formData: FormData) {
	const password = formData.get('password') as string;
	const confirmPassword = formData.get('confirmPassword') as string;

	/*
	 * Query the database to find the user by the reset token; return an error if invalid or expired.
	 * Hash the new password before saving it in the database.
	 * Update the user's password, and clear the reset token and expiry time.
	 * Return a success message confirming the password update.
	 */
}
