'use client';

import { submitGoogleLogin } from '@/app/auth/actions';
import { Button } from '@workspace/ui/components/button';
import { Loader2Icon, Mail } from 'lucide-react';
import { useState } from 'react';

export function GoogleLogin() {
	const [loading, setLoading] = useState(false);

	const handleLogin = async () => {
		setLoading(true); // UI updates immediately
		submitGoogleLogin();
	};

	return (
		<Button
			type='button'
			onClick={handleLogin}
			variant='outline'
			className='w-full'
			disabled={loading}
		>
			{loading ? <Loader2Icon className='animate-spin' /> : <Mail />}
			{loading ? 'Please wait' : 'Login with Google'}
		</Button>
	);
}
