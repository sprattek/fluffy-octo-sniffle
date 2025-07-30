'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export default function OAuthCallbackPage() {
	const searchParams = useSearchParams();
	const router = useRouter();

	const fetchUser = async (token: string) => {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (res.ok) {
			const data = await res.json();
			localStorage.setItem(
				'firepit-auth',
				JSON.stringify({ token: token, user: data.user })
			);
			router.replace('/dashboard'); // Or wherever you want to land after login
		} else {
			router.replace('/login');
		}
	};

	const verifyUser = async (verificationToken: string, email: string) => {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ token: verificationToken, email }),
			}
		);
		const data = await res.json();
		if (res.ok) {
			fetchUser(data.token);
		} else {
			toast.error('Verification failed!', {
				description: data.error,
			});
			router.replace('/login');
		}
	};

	useEffect(() => {
		const token = searchParams.get('token');
		const verificationToken = searchParams.get('verificationToken');
		const email = searchParams.get('email');
		if (token) {
			fetchUser(token);
			return;
		}
		if (verificationToken && email) {
			verifyUser(verificationToken, email);
			return;
		}
		router.replace('/login');
	}, [searchParams]);

	return <p>Signing you in...</p>;
}
