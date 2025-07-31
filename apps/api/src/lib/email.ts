import { Resend } from 'resend';

const resend = new Resend(process.env.AUTH_RESEND_KEY);

export async function sendResetEmail(email: string, token: string) {
	const resetLink = `${process.env.FRONTEND_URL}/auth/callback?verificationToken=${token}&email=${email}`;

	await resend.emails.send({
		from: 'noreply@info.tattek.sk',
		to: email,
		subject: 'Access link to your firepit account',
		html: `<p>Click <a href="${resetLink}">here</a> to access the firepit account.</p>`,
	});
}
