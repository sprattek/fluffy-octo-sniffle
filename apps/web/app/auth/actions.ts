'use client';

export function submitGithubLogin() {
	window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/github`;
}

export function submitGoogleLogin() {
	window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
}

export function logout(redirectTo: string = '/login') {
	localStorage.removeItem('firepit-auth');
	window.location.href = redirectTo;
}
