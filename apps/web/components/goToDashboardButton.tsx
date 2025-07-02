'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@workspace/ui/components/button';

export function GoToDashboardButton() {
	const router = useRouter();

	return (
		<Button onClick={() => router.push('/dashboard')} size='sm'>
			Go to dashboard
		</Button>
	);
}
