'use client';

import { cn } from '@workspace/ui/lib/utils';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@workspace/ui/components/card';
import { Label } from '@workspace/ui/components/label';
import { Input } from '@workspace/ui/components/input';
import { useActionState, useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Button } from '@workspace/ui/components/button';
import { Loader2Icon } from 'lucide-react';
import Link from 'next/link';
import { resetPassword } from '@/app/forgot-password/actions';

const initialState = { success: false, error: '' };

export function ForgotPasswordForm({
	className,
	...props
}: React.ComponentProps<'div'>) {
	const [state, formAction] = useActionState(
		(_prevState: any, formData: FormData) => resetPassword(formData),
		initialState
	);
	const [isPending, startTransition] = useTransition();
	const [form, setForm] = useState({
		email: '',
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	// 🎯 Show toast on state change
	useEffect(() => {
		if (state?.success) {
			toast.message('Access link email sent 🎉', {
				description: 'Check your inbox',
			});
		} else if (state?.error) {
			toast.error('Access link send failed', {
				description: state.error,
			});
		}
	}, [state, toast]);

	return (
		<div className={cn('flex flex-col gap-6', className)} {...props}>
			<Card>
				<CardHeader className='text-center'>
					<CardTitle className='text-xl'>Forgot Password?</CardTitle>
					<CardDescription>
						No worries, we'll send you an access link
					</CardDescription>
				</CardHeader>
				<CardContent className='grid gap-4'>
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
							{!state?.success && state?.error && (
								<p className='text-sm text-red-500'>{state.error}</p>
							)}

							<Button type='submit' disabled={isPending} className='w-full'>
								{isPending ? (
									<Loader2Icon className='animate-spin' />
								) : (
									'Send me an access link'
								)}
							</Button>
						</div>
						<div className='text-center text-sm mt-6'>
							Do you remember your password?{' '}
							<Link href='/login' className='underline underline-offset-4'>
								Sign in
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
