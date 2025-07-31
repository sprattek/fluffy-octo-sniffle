'use client';

export async function locationToAddress({
	latitude,
	longitude,
	token,
}: {
	latitude: number;
	longitude: number;
	token: string;
}) {
	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/geo/reverse`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ latitude, longitude }),
		});

		if (!res.ok) {
			const body = await res.json();
			throw new Error(body?.error || 'Server error');
		}

		console.log('[reverseGeocode]', await res.json());

		return { success: true };
	} catch (err) {
		console.error('[reverseGeocode ERROR]', err);
		return { success: false, error: 'Something went wrong. Please try again.' };
	}
}
