'use client';

import { useAuth } from '@/auth-context';
import { GoToDashboardButton } from '@/components/goToDashboardButton';

export default function Page() {
	const { user } = useAuth();

	return (
		<div className='flex items-center justify-center min-h-svh'>
			<div className='flex flex-col items-center justify-center gap-4'>
				<h1 className='text-2xl font-bold'>Hello World</h1>
				<div className='rounded-t-md p-4 font-bold'>Current Session</div>
				<pre className='whitespace-pre-wrap break-all px-4 py-6'>
					{JSON.stringify(user, null, 2)}
				</pre>
				<GoToDashboardButton />
			</div>
		</div>
	);
}
