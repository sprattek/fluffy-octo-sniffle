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
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@workspace/ui/components/button';
import { Loader2Icon } from 'lucide-react';
import Link from 'next/link';
import { passwordResetSchema } from '@workspace/validators';

const initialState: { success: boolean; error?: string } = { success: false };

export function ForgotPasswordForm({
	className,
	...props
}: React.ComponentProps<'div'>) {
	const [form, setForm] = useState({
		email: '',
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [state, setState] = useState(initialState);
	const [fieldErrors, setFieldErrors] = useState<
		Record<string, string[] | undefined>
	>({});

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

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		setIsSubmitting(true);
		e.preventDefault();

		const parsed = passwordResetSchema.safeParse(form);
		if (!parsed.success) {
			const errors = parsed.error.flatten().fieldErrors;
			setFieldErrors(errors);
			setState({
				success: false,
				error: Object.values(errors).flat().join(', ') || 'Invalid input',
			});
			setIsSubmitting(false);
			return;
		}

		const res = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(parsed.data),
			}
		);

		const data = await res.json();

		if (!res.ok) {
			setState({ success: false, error: data?.error || 'Unknown error' });
			setIsSubmitting(false);
			return;
		}

		setState({ success: true });
		setIsSubmitting(false);

		/*localStorage.setItem(
				'firepit-auth',
				JSON.stringify({ token: data.token, user: data.user })
			);*/

		// router.push('/dashboard');
	};

	return (
		<div className={cn('flex flex-col gap-6', className)} {...props}>
			<Card>
				<CardHeader className='text-center'>
					<CardTitle className='text-xl'>Forgot Password?</CardTitle>
					<CardDescription>
						{!state.success
							? `No worries, we'll send you password reset link`
							: `We've sent password reset link to ${form.email}`}
					</CardDescription>
				</CardHeader>
				<CardContent className='grid gap-4'>
					{!state.success ? (
						<form onSubmit={handleSubmit}>
							<div className='grid gap-6'>
								<div className='grid gap-3'>
									<Label htmlFor='email'>Email</Label>
									<Input
										aria-invalid={!!fieldErrors.email || undefined}
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

								<Button
									type='submit'
									disabled={isSubmitting}
									className='w-full'
								>
									{isSubmitting ? (
										<Loader2Icon className='animate-spin' />
									) : (
										'Reset my password'
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
					) : (
						<Link
							href='/login'
							className='underline underline-offset-4 text-center'
						>
							Go Back
						</Link>
					)}
				</CardContent>
			</Card>
			<div className='text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4'>
				By clicking continue, you agree to our <a href='#'>Terms of Service</a>{' '}
				and <a href='#'>Privacy Policy</a>.
			</div>
		</div>
	);
}
