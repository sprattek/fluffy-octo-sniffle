'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@workspace/ui/components/form';
import {
	InputBase,
	InputBaseAdornment,
	InputBaseControl,
	InputBaseInput,
} from '@workspace/ui/components/input-base';
import { Input } from '@workspace/ui/components/input';
import { Textarea } from '@workspace/ui/components/textarea';
import { Button } from '@workspace/ui/components/button';
import { useForm } from 'react-hook-form';
import { FormBlock } from '@/components/forms';
import { CheckCircle, Euro, Loader2Icon, Users } from 'lucide-react';
import { useState } from 'react';
import { firepitSchema, FirepitSchemaModel } from '@workspace/validators';
import { useAuth } from '@/auth-context';
import { RequireAuth } from '@/components/auth/requireAuth';
import { redirect } from 'next/navigation';
import { submitFirepit } from '../actions';

export default function CreateFirepit() {
	const { isAuthenticated, token } = useAuth();
	const [loading, setLoading] = useState(false);

	const form = useForm<FirepitSchemaModel>({
		resolver: zodResolver(firepitSchema),
		defaultValues: {
			name: '',
			description: '',
			latitude: 0,
			longitude: 0,
			city: '',
			pricePerDay: 0,
			optimalNumberOfVisitors: 0,
		},
	});

	const onSubmit = async (data: FirepitSchemaModel) => {
		setLoading(true);

		if (!isAuthenticated) {
			return {
				success: false,
				error: 'You must be logged in to create a firepit',
			};
		}

		const result = await submitFirepit(data, token!);

		if (!result.success) {
			setLoading(false);
			return;
		}

		toast('Firepit created successfully', {
			description: (
				<pre className='mt-2 w-[320px] rounded-md bg-neutral-950 p-4'>
					<code className='text-white'>{JSON.stringify(data, null, 2)}</code>
				</pre>
			),
		});

		redirect(`/firepits`);
	};

	return (
		<RequireAuth>
			<div className='mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8'>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<div className='space-y-12'>
							<FormBlock
								title='General'
								description='This information will be displayed publicly so be careful what you share.'
							>
								<div className='sm:col-span-4'>
									<FormField
										control={form.control}
										name='name'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Name</FormLabel>
												<FormControl>
													<Input placeholder='Firepit' {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className='col-span-full'>
									<FormField
										control={form.control}
										name='description'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Description</FormLabel>
												<FormControl>
													<Textarea rows={3} {...field} />
												</FormControl>
												<FormDescription>
													Write a few sentences about this firepit.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</FormBlock>
							<FormBlock
								title='Location'
								description='This information will help people to find a firepit.'
							>
								<div className='sm:col-span-2 sm:col-start-1'>
									<FormField
										control={form.control}
										name='city'
										render={({ field }) => (
											<FormItem>
												<FormLabel>City</FormLabel>
												<FormControl>
													<Input placeholder='City' {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className='sm:col-span-2'>
									<FormField
										control={form.control}
										name='latitude'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Latitude</FormLabel>
												<FormControl>
													<Input
														placeholder='Latitude'
														type='number'
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className='sm:col-span-2'>
									<FormField
										control={form.control}
										name='longitude'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Longitude</FormLabel>
												<FormControl>
													<Input
														placeholder='Longitude'
														type='number'
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</FormBlock>
							<FormBlock
								title='Reservation'
								description='All the reservation information will be displayed publicly so be careful what you share.'
							>
								<div className='sm:col-span-4'>
									<FormField
										control={form.control}
										name='pricePerDay'
										render={({ field, fieldState }) => (
											<FormItem>
												<FormLabel>Price per day</FormLabel>
												<InputBase error={Boolean(fieldState.error)}>
													<InputBaseAdornment>
														<Euro />
													</InputBaseAdornment>
													<InputBaseControl>
														<FormControl>
															<InputBaseInput
																placeholder='0'
																type='number'
																{...field}
															/>
														</FormControl>
													</InputBaseControl>
													<InputBaseAdornment>
														<p>EUR</p>
													</InputBaseAdornment>
												</InputBase>
												<FormDescription>
													Keep blank or set to 0 if the firepit is free of
													charge.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className='sm:col-span-4'>
									<FormField
										control={form.control}
										name='optimalNumberOfVisitors'
										render={({ field, fieldState }) => (
											<FormItem>
												<FormLabel>Optimal number of visitors</FormLabel>
												<InputBase error={Boolean(fieldState.error)}>
													<InputBaseAdornment>
														<Users />
													</InputBaseAdornment>
													<InputBaseControl>
														<FormControl>
															<InputBaseInput
																type='number'
																placeholder='6'
																{...field}
															/>
														</FormControl>
													</InputBaseControl>
													<InputBaseAdornment>
														<p>Visitors</p>
													</InputBaseAdornment>
												</InputBase>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</FormBlock>
							<div className='mt-6 flex items-center justify-end gap-x-6'>
								<Button
									type='button'
									variant='ghost'
									onClick={() => redirect('/firepits')}
								>
									Cancel
								</Button>
								<Button
									type='submit'
									variant='default'
									disabled={!form.formState.isValid || loading}
								>
									{loading ? (
										<Loader2Icon className='animate-spin' />
									) : (
										<CheckCircle />
									)}
									{loading ? 'Please wait...' : 'Submit'}
								</Button>
							</div>
						</div>
					</form>
				</Form>
			</div>
		</RequireAuth>
	);
}
