'use client';

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
import { signUp } from '@/app/register/actions';
import { useActionState, useEffect, useState, useTransition } from 'react';
import { Loader2Icon } from 'lucide-react';
import { toast } from 'sonner';

const initialState = { success: false, error: '' };

export function RegisterForm({
	className,
	...props
}: React.ComponentProps<'div'>) {
	const [state, formAction] = useActionState(
		(_prevState: any, formData: FormData) => signUp(formData),
		initialState
	);
	const [isPending, startTransition] = useTransition();
	const [form, setForm] = useState({
		name: '',
		email: '',
		password: '',
		passwordConfirm: '',
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	// 🎯 Show toast on state change
	useEffect(() => {
		if (state?.success) {
			toast.message('Registration successful 🎉', {
				description: 'Welcome! Redirecting...',
			});
		} else if (state?.error) {
			toast.error('Registration failed', {
				description: state.error,
			});
		}
	}, [state, toast]);

	return (
		<div className={cn('flex flex-col gap-6', className)} {...props}>
			<Card>
				<CardHeader className='text-center'>
					<CardTitle className='text-xl'>Sign up</CardTitle>
					<CardDescription>Create a new account</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						action={(formData) => {
							startTransition(() => formAction(formData));
						}}
					>
						<div className='grid gap-6'>
							<div className='grid gap-6'>
								<div className='grid gap-3'>
									<Label htmlFor='name'>Name</Label>
									<Input
										aria-describedby='name'
										name='name'
										id='name'
										type='text'
										value={form.name}
										onChange={handleChange}
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
										value={form.email}
										onChange={handleChange}
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
										value={form.password}
										onChange={handleChange}
										required
									/>
								</div>
								<div className='grid gap-3'>
									<div className='flex items-center'>
										<Label htmlFor='passwordConfirm'>
											Password Confirmation
										</Label>
									</div>
									<Input
										aria-describedby='passwordConfirm'
										name='passwordConfirm'
										id='passwordConfirm'
										type='password'
										value={form.passwordConfirm}
										onChange={handleChange}
										required
									/>
								</div>

								{!state?.success && state?.error && (
									<p className='text-sm text-red-500'>{state.error}</p>
								)}

								<Button type='submit' disabled={isPending} className='w-full'>
									{isPending ? (
										<Loader2Icon className='animate-spin' />
									) : (
										'Sign up'
									)}
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
