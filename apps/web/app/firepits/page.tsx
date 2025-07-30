'use client';

import { useAuth } from '@/auth-context';
import { Button } from '@workspace/ui/components/button';
import { Plus } from 'lucide-react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Firepits() {
	const { isAuthenticated } = useAuth();
	const [firepits, setFirepits] = useState([]);
	const [loading, setLoading] = useState(true);

	const fetchFirepits = async () => {
		setLoading(true);
		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/firepits`);

			if (res.ok) {
				const data = await res.json();
				setFirepits(data);
			} else {
				setFirepits([]);
			}
		} catch {
			setFirepits([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchFirepits();
	}, []);

	return (
		<div className='flex items-center justify-center min-h-svh'>
			<div className='flex flex-col items-center justify-center gap-4'>
				<h1 className='text-2xl font-bold'>Firepits</h1>
				<div className='flex my-6'>
					<pre>
						{loading ? 'Loading...' : JSON.stringify(firepits, null, 2)}
					</pre>
					<Button
						disabled={!isAuthenticated}
						onClick={() => redirect('/firepits/create')}
					>
						<Plus />
						Add new firepit
					</Button>
				</div>
			</div>
		</div>
	);
}
