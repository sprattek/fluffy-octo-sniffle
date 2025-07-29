'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/auth-context';

export function RequireAuth({ children }: { children: React.ReactNode }) {
	const { user, loading, isAuthenticated } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!loading && !isAuthenticated) {
			router.replace('/login');
		}
	}, [loading, isAuthenticated]);

	if (loading || !isAuthenticated) {
		return <div>Loading...</div>; // You can show a spinner here
	}

	return <>{children}</>;
}
