import { object, string } from 'zod';

export const loginSchema = object({
	email: string({ required_error: 'Email is required' })
		.min(3, 'Email is required')
		.email('Invalid email'),
	password: string({ required_error: 'Password is required' })
		.min(1, 'Password is required')
		.min(8, 'Password must be more than 8 characters')
		.max(32, 'Password must be less than 32 characters'),
});

export const registerSchema = object({
	name: string({ required_error: 'Name is required' }).min(
		1,
		'Name is required'
	),
	email: string({ required_error: 'Email is required' })
		.min(3, 'Email is required')
		.email('Invalid email'),
	password: string({ required_error: 'Password is required' })
		.min(1, 'Password is required')
		.min(8, 'Password must be more than 8 characters')
		.max(32, 'Password must be less than 32 characters'),
	passwordConfirm: string({
		required_error: 'Password confirmation is required',
	})
		.min(1, 'Password confirmation is required')
		.min(8, 'Password confirmation must be more than 8 characters')
		.max(32, 'Password confirmation must be less than 32 characters'),
}).refine((data) => data.password === data.passwordConfirm, {
	message: 'Passwords do not match',
	path: ['passwordConfirm'],
});
