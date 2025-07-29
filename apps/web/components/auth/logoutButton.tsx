import { logout } from './logout';
import { Button } from '@workspace/ui/components/button';
import { LogOut } from 'lucide-react';

export function LogoutButton({
	redirectTo = '/login',
}: {
	redirectTo?: string;
}) {
	return (
		<Button
			onClick={() => {
				logout(redirectTo);
			}}
			variant='outline'
			className='w-full'
		>
			<LogOut />
			Sign out
		</Button>
	);
}
