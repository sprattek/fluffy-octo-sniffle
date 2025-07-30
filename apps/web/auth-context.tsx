'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface User {
	id: string;
	email: string;
	name?: string;
}

interface AuthContextType {
	user: User | null;
	loading: boolean;
	isAuthenticated: boolean;
	token: string | null;
	refetch: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [token, setToken] = useState<string | null>(null);
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	const fetchUser = async () => {
		setLoading(true);
		try {
			const authData = JSON.parse(
				localStorage.getItem('firepit-auth') as string
			);
			const token = authData?.token;

			if (!token) {
				setUser(null);
				setToken(null);
				return;
			}

			const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (res.ok) {
				const data = await res.json();
				setUser(data.user);
				setToken(token);
			} else {
				setUser(null);
				setToken(null);
			}
		} catch {
			setUser(null);
			setToken(null);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUser();
	}, []);

	return (
		<AuthContext.Provider
			value={{
				token,
				user,
				loading,
				isAuthenticated: !!user,
				refetch: fetchUser,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}
