'use client';

import { loginSchema, LoginSchemaModel } from '@workspace/validators';
import { toast } from 'sonner';

export async function submitLogin(form: LoginSchemaModel) {
	const parsed = loginSchema.safeParse(form);

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
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(parsed.data),
		});

		const data = await res.json();

		if (!res.ok) {
			return {
				success: false,
				error: data?.error || 'Login failed',
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
		console.error('[submitLogin ERROR]', err);
		toast.error('Login failed', {
			description: 'Something went wrong. Please try again.',
		});
		return { success: false, error: 'Something went wrong' };
	}
}
