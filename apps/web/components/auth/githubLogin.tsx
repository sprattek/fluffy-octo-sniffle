'use client';

import { Button } from '@workspace/ui/components/button';
import { Github, Loader2Icon } from 'lucide-react';
import { useState } from 'react';

export function GithubLogin() {
	const [loading, setLoading] = useState(false);

	const handleLogin = async () => {
		setLoading(true); // UI updates immediately
		window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/github`;
	};

	return (
		<Button
			type='button'
			onClick={handleLogin}
			variant='outline'
			className='w-full'
			disabled={loading}
		>
			{loading ? <Loader2Icon className='animate-spin' /> : <Github />}
			{loading ? 'Please wait' : 'Login with GitHub'}
		</Button>
	);
}
