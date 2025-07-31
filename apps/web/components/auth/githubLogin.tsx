'use client';

import { submitGithubLogin } from '@/app/auth/actions';
import { Button } from '@workspace/ui/components/button';
import { Github, Loader2Icon } from 'lucide-react';
import { useState } from 'react';

export function GithubLogin() {
	const [loading, setLoading] = useState(false);

	const handleLogin = () => {
		setLoading(true); // UI updates immediately
		submitGithubLogin();
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
