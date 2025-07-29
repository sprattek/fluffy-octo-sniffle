'use client';

import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { loginSchema } from '@workspace/validators';
import { Loader2Icon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const initialState: { success: boolean; error?: string } = { success: false };

export function CredentialsLogin() {
	const [form, setForm] = useState({
		email: '',
		password: '',
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [state, setState] = useState(initialState);
	const [fieldErrors, setFieldErrors] = useState<
		Record<string, string[] | undefined>
	>({});
	const router = useRouter();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
		setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
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

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		setIsSubmitting(true);
		e.preventDefault();

		const parsed = loginSchema.safeParse(form);
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

		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(parsed.data),
		});

		const data = await res.json();

		if (!res.ok) {
			setState({ success: false, error: data?.error || 'Unknown error' });
			setIsSubmitting(false);
			return;
		}

		setState({ success: true });
		setIsSubmitting(false);

		localStorage.setItem(
			'firepit-auth',
			JSON.stringify({ token: data.token, user: data.user })
		);

		router.push('/dashboard');
	};

	return (
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
						aria-invalid={!!fieldErrors.password || undefined}
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

				<Button type='submit' disabled={isSubmitting} className='w-full'>
					{isSubmitting ? <Loader2Icon className='animate-spin' /> : 'Login'}
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
