import { cn } from '@workspace/ui/lib/utils';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@workspace/ui/components/card';
import { GithubLogin } from './githubLogin';
import { GoogleLogin } from './googleLogin';
import { CredentialsLogin } from './credentialsLogin';

export function LoginForm({
	className,
	...props
}: React.ComponentProps<'div'>) {
	return (
		<div className={cn('flex flex-col gap-6', className)} {...props}>
			<Card>
				<CardHeader className='text-center'>
					<CardTitle className='text-xl'>Welcome back</CardTitle>
					<CardDescription>Login with your account</CardDescription>
				</CardHeader>
				<CardContent className='grid gap-4'>
					<GithubLogin />
					<GoogleLogin />
					<div className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
						<span className='bg-card text-muted-foreground relative z-10 px-2'>
							Or continue with
						</span>
					</div>
					<CredentialsLogin />
				</CardContent>
			</Card>
			<div className='text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4'>
				By clicking continue, you agree to our <a href='#'>Terms of Service</a>{' '}
				and <a href='#'>Privacy Policy</a>.
			</div>
		</div>
	);
}
