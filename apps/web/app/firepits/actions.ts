'use client';

import { firepitSchema, FirepitSchemaModel } from '@workspace/validators';
import { toast } from 'sonner';

export async function submitFirepit(data: FirepitSchemaModel, token: string) {
	const parsed = firepitSchema.safeParse(data);

	if (!parsed.success) {
		const errors = parsed.error.flatten().fieldErrors;
		const firstError =
			Object.values(errors)
				.flat()
				.find((e) => typeof e === 'string') || 'Invalid input';

		return {
			success: false,
			error: firstError,
		};
	}

	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/firepits`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(data),
		});

		if (!res.ok) {
			const body = await res.json();
			throw new Error(body?.error || 'Server error');
		}

		return { success: true };
	} catch (err) {
		console.error('[submitFirepit ERROR]', err);
		toast.error('Could not create firepit', {
			description: err instanceof Error ? err.message : 'Unknown error',
		});
		return { success: false, error: 'Something went wrong. Please try again.' };
	}
}
