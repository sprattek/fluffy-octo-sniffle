'use client';

export function logout(redirectTo: string = '/login') {
	localStorage.removeItem('firepit-auth');
	window.location.href = redirectTo;
}
