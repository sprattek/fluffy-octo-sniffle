'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/auth-context';

export function RedirectIfAuthenticated({
	children,
	redirectTo = '/dashboard',
}: {
	children: React.ReactNode;
	redirectTo?: string;
}) {
	const { isAuthenticated, loading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!loading && isAuthenticated) {
			router.replace(redirectTo);
		}
	}, [loading, isAuthenticated]);

	if (loading || isAuthenticated) {
		return <div>Redirecting...</div>; // Optional spinner
	}

	return <>{children}</>;
}
