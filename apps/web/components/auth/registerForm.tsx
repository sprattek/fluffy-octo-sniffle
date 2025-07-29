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
import { useEffect, useState } from 'react';
import { registerSchema } from '@workspace/validators';
import { Loader2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const initialState: { success: boolean; error?: string } = { success: false };

export function RegisterForm({
	className,
	...props
}: React.ComponentProps<'div'>) {
	const [form, setForm] = useState({
		name: '',
		email: '',
		password: '',
		passwordConfirm: '',
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
			toast.message('Registration successful 🎉', {
				description: 'Welcome! Redirecting...',
			});
		} else if (state?.error) {
			toast.error('Registration failed', {
				description: state.error,
			});
		}
	}, [state, toast]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		setIsSubmitting(true);
		e.preventDefault();

		const parsed = registerSchema.safeParse(form);
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
			`${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
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

		localStorage.setItem(
			'firepit-auth',
			JSON.stringify({ token: data.token, user: data.user })
		);

		router.push('/dashboard');
	};

	return (
		<div className={cn('flex flex-col gap-6', className)} {...props}>
			<Card>
				<CardHeader className='text-center'>
					<CardTitle className='text-xl'>Sign up</CardTitle>
					<CardDescription>Create a new account</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit}>
						<div className='grid gap-6'>
							<div className='grid gap-6'>
								<div className='grid gap-3'>
									<Label htmlFor='name'>Name</Label>
									<Input
										aria-invalid={!!fieldErrors.name || undefined}
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
										aria-invalid={!!fieldErrors.email || undefined}
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
										aria-invalid={!!fieldErrors.password || undefined}
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
										aria-invalid={!!fieldErrors.passwordConfirm || undefined}
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

								<Button
									type='submit'
									disabled={isSubmitting}
									className='w-full'
								>
									{isSubmitting ? (
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
