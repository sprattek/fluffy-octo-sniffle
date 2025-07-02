import { auth, signOut } from '@/auth';
import { Button } from '@workspace/ui/components/button';
import { LogOut } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
	const session = await auth();

	if (!session?.user) {
		// Just in case — fallback protection
		redirect('/login');
	}

	return (
		<div className='max-w-3xl mx-auto mt-10'>
			<h1 className='text-2xl font-bold'>Welcome to your dashboard</h1>
			<p className='mt-2 text-gray-600'>Logged in as: {session.user.email}</p>
			<form
				action={async () => {
					'use server';
					await signOut({
						redirectTo: '/login',
					});
				}}
			>
				<div className='flex flex-col gap-4'>
					<Button type='submit' variant='outline' className='w-full'>
						<LogOut />
						Sign out
					</Button>
				</div>
			</form>
		</div>
	);
}
