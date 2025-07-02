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
import { prisma } from '@workspace/database';
import Link from 'next/link';

export function RegisterForm({
	className,
	...props
}: React.ComponentProps<'div'>) {
	const onSignup = async (formData: FormData) => {
		'use server';

		const name = formData.get('name') as string;
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const passwordConfirm = formData.get('password-confirm') as string;

		if (
			!email ||
			!password ||
			!name ||
			!passwordConfirm ||
			password !== passwordConfirm
		)
			return;

		console.log('signup', email, password, name);
	};

	return (
		<div className={cn('flex flex-col gap-6', className)} {...props}>
			<Card>
				<CardHeader className='text-center'>
					<CardTitle className='text-xl'>Sign up</CardTitle>
					<CardDescription>Create a new account</CardDescription>
				</CardHeader>
				<CardContent>
					<form action={onSignup}>
						<div className='grid gap-6'>
							<div className='grid gap-6'>
								<div className='grid gap-3'>
									<Label htmlFor='name'>Name</Label>
									<Input
										aria-describedby='name'
										name='name'
										id='name'
										type='text'
										placeholder='John Doe'
										required
									/>
								</div>
								<div className='grid gap-3'>
									<Label htmlFor='email'>Email</Label>
									<Input
										aria-describedby='email'
										name='email'
										id='email'
										type='email'
										placeholder='m@example.com'
										required
									/>
								</div>
								<div className='grid gap-3'>
									<div className='flex items-center'>
										<Label htmlFor='password'>Password</Label>
									</div>
									<Input
										aria-describedby='password'
										name='password'
										id='password'
										type='password'
										required
									/>
								</div>
								<div className='grid gap-3'>
									<div className='flex items-center'>
										<Label htmlFor='password-confirm'>
											Password Confirmation
										</Label>
									</div>
									<Input
										aria-describedby='password-confirmation'
										name='password-confirm'
										id='password-confirm'
										type='password'
										required
									/>
								</div>
								<Button type='submit' className='w-full'>
									Signup
								</Button>
							</div>
							<div className='text-center text-sm'>
								Already have an account?{' '}
								<Link href='/login' className='underline underline-offset-4'>
									Log in
								</Link>
							</div>
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
