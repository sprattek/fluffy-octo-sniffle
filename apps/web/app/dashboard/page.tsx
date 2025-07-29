'use client';

import { useAuth } from '@/auth-context';
import { LogoutButton } from '@/components/auth/logoutButton';
import { RequireAuth } from '@/components/auth/requireAuth';

export default function DashboardPage() {
	const { user } = useAuth();

	return (
		<RequireAuth>
			<div className='max-w-3xl mx-auto mt-10'>
				<h1 className='text-2xl font-bold'>Welcome to your dashboard</h1>
				<p className='mt-2 text-gray-600'>Logged in as: {user?.email}</p>
				<LogoutButton />
			</div>
		</RequireAuth>
	);
}
