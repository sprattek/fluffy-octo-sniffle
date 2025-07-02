import { prisma } from '@workspace/database';
import { auth } from '@/auth';
import { GoToDashboardButton } from '@/components/goToDashboardButton';

export default async function Page() {
	const users = await prisma.user.findMany();
	const session = await auth();

	return (
		<div className='flex items-center justify-center min-h-svh'>
			<div className='flex flex-col items-center justify-center gap-4'>
				<h1 className='text-2xl font-bold'>Hello World</h1>
				<pre>{JSON.stringify(users, null, 2)}</pre>
				<GoToDashboardButton />
			</div>
			<div className='flex flex-col rounded-md'>
				<div className='rounded-t-md p-4 font-bold'>Current Session</div>
				<pre className='whitespace-pre-wrap break-all px-4 py-6'>
					{JSON.stringify(session, null, 2)}
				</pre>
			</div>
		</div>
	);
}
