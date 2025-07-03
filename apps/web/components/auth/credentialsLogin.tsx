'use client';

import { logIn } from '@/app/login/actions';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Loader2Icon } from 'lucide-react';
import Link from 'next/link';
import { useActionState, useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';

const initialState = { success: false, error: '' };

export function CredentialsLogin() {
	const [state, formAction] = useActionState(
		(_prevState: any, formData: FormData) => logIn(formData),
		initialState
	);
	const [isPending, startTransition] = useTransition();
	const [form, setForm] = useState({
		email: '',
		password: '',
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	// 🎯 Show toast on state change
	useEffect(() => {
		if (state?.success) {
			toast.message('Login successful 🎉', {
				description: 'Welcome! Redirecting...',
			});
		} else if (state?.error) {
			toast.error('Login failed', {
				description: state.error,
			});
		}
	}, [state, toast]);

	return (
		<form
			action={(formData) => {
				startTransition(() => formAction(formData));
			}}
		>
			<div className='grid gap-6'>
				<div className='grid gap-3'>
					<Label htmlFor='email'>Email</Label>
					<Input
						id='email'
						name='email'
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
						<Link
							href='/forgot-password'
							className='ml-auto text-sm underline-offset-4 hover:underline'
						>
							Forgot your password?
						</Link>
					</div>
					<Input
						id='password'
						name='password'
						type='password'
						value={form.password}
						onChange={handleChange}
						required
					/>
				</div>
				{!state?.success && state?.error && (
					<p className='text-sm text-red-500'>{state.error}</p>
				)}

				<Button type='submit' disabled={isPending} className='w-full'>
					{isPending ? <Loader2Icon className='animate-spin' /> : 'Login'}
				</Button>
			</div>
			<div className='text-center text-sm mt-6'>
				Don&apos;t have an account?{' '}
				<Link href='/register' className='underline underline-offset-4'>
					Sign up
				</Link>
			</div>
		</form>
	);
}
