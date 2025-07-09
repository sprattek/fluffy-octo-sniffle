import { auth } from '@/auth';
import { Button } from '@workspace/ui/components/button';
import { Plus } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function Firepits() {
	const session = await auth();

	return (
		<div className='flex items-center justify-center min-h-svh'>
			<div className='flex flex-col items-center justify-center gap-4'>
				<h1 className='text-2xl font-bold'>Firepits</h1>
				<div className='flex my-6'>
					<form
						action={async () => {
							'use server';
							redirect('/firepits/create');
						}}
					>
						<Button disabled={!session?.user}>
							<Plus />
							Add new firepit
						</Button>
					</form>
				</div>
			</div>
		</div>
	);
}
