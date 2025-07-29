'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { AuthProvider } from '@/auth-context';

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<NextThemesProvider
			attribute='class'
			defaultTheme='system'
			enableSystem
			disableTransitionOnChange
			enableColorScheme
		>
			<AuthProvider>{children}</AuthProvider>
		</NextThemesProvider>
	);
}
