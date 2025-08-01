'use client';

import {
	passwordResetSchema,
	PasswordResetSchemaModel,
} from '@workspace/validators';
import { toast } from 'sonner';

export async function submitPasswordReset(form: PasswordResetSchemaModel) {
	const parsed = passwordResetSchema.safeParse(form);

	if (!parsed.success) {
		const errors = parsed.error.flatten().fieldErrors;
		const firstError =
			Object.values(errors)
				.flat()
				.find((e) => typeof e === 'string') || 'Invalid input';

		return {
			success: false,
			error: firstError,
			fieldErrors: errors,
		};
	}

	try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(parsed.data),
			}
		);

		const data = await res.json();

		if (!res.ok) {
			return {
				success: false,
				error: data?.error || 'Password reset failed',
			};
		}

		return {
			success: true,
		};
	} catch (err) {
		console.error('[submitPasswordReset ERROR]', err);
		toast.error('Password reset failed', {
			description: 'Something went wrong. Please try again.',
		});
		return { success: false, error: 'Something went wrong' };
	}
}
