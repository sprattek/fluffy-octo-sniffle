'use client';

import { registerSchema, RegisterSchemaModel } from '@workspace/validators';
import { toast } from 'sonner';

export async function submitRegistration(form: RegisterSchemaModel) {
	const parsed = registerSchema.safeParse(form);

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
			`${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
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
				error: data?.error || 'Registration failed',
			};
		}

		localStorage.setItem(
			'firepit-auth',
			JSON.stringify({ token: data.token, user: data.user })
		);

		return {
			success: true,
			user: data.user,
			token: data.token,
		};
	} catch (err) {
		console.error('[submitRegistration ERROR]', err);
		toast.error('Registration failed', {
			description: 'Something went wrong. Please try again.',
		});
		return { success: false, error: 'Something went wrong' };
	}
}
