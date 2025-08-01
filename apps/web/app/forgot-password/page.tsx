import { GalleryVerticalEnd } from 'lucide-react';
import { ForgotPasswordForm } from '@/components/auth/forgotPasswordForm';
import { RedirectIfAuthenticated } from '@/components/auth/redirectIfAuthenticated';

export default async function ForgotPasswordPage() {
	return (
		<RedirectIfAuthenticated>
			<div className='bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10'>
				<div className='flex w-full max-w-sm flex-col gap-6'>
					<a
						href='#'
						className='flex items-center gap-2 self-center font-medium'
					>
						<div className='bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md'>
							<GalleryVerticalEnd className='size-4' />
						</div>
						FirepitApp
					</a>
					<ForgotPasswordForm />
				</div>
			</div>
		</RedirectIfAuthenticated>
	);
}
