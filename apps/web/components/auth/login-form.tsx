import { cn } from '@workspace/ui/lib/utils';
import { Button } from '@workspace/ui/components/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@workspace/ui/components/card';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import Link from 'next/link';
import { Github } from 'lucide-react';
import { signIn } from '@/auth';

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
				<CardContent className='grid gap-6'>
					<form
						action={async () => {
							'use server';
							await signIn('github', {
								redirectTo: '/',
							});
						}}
					>
						<div className='flex flex-col gap-4'>
							<Button type='submit' variant='outline' className='w-full'>
								<Github />
								Login with GitHub
							</Button>
						</div>
					</form>

					<form>
						<div className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
							<span className='bg-card text-muted-foreground relative z-10 px-2'>
								Or continue with
							</span>
						</div>
						<div className='grid gap-6'>
							<div className='grid gap-3'>
								<Label htmlFor='email'>Email</Label>
								<Input
									id='email'
									type='email'
									placeholder='m@example.com'
									required
								/>
							</div>
							<div className='grid gap-3'>
								<div className='flex items-center'>
									<Label htmlFor='password'>Password</Label>
									<a
										href='#'
										className='ml-auto text-sm underline-offset-4 hover:underline'
									>
										Forgot your password?
									</a>
								</div>
								<Input id='password' type='password' required />
							</div>
							<Button type='submit' className='w-full'>
								Login
							</Button>
						</div>
						<div className='text-center text-sm'>
							Don&apos;t have an account?{' '}
							<Link href='/register' className='underline underline-offset-4'>
								Sign up
							</Link>
						</div>
					</form>
				</CardContent>
			</Card>
			<div className='text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4'>
				By clicking continue, you agree to our <a href='#'>Terms of Service</a>{' '}
				and <a href='#'>Privacy Policy</a>.
			</div>
		</div>
	);
}
