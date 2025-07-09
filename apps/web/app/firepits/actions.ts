'use server';

import { auth } from '@/auth';
import { firepitSchema, FirepitSchemaModel } from '@/lib/validations/firepit';
import { prisma } from '@workspace/database';

type ActionResult = { success: true } | { success: false; error: string };

const createFirepit = async ({
	data,
}: {
	data: FirepitSchemaModel;
}): Promise<ActionResult> => {
	const session = await auth();

	if (!session?.user?.id) {
		return {
			success: false,
			error: 'You must be logged in to create a firepit',
		};
	}

	const parsed = firepitSchema.safeParse(data);

	if (!parsed.success) {
		const errors = parsed.error.flatten().fieldErrors;
		return {
			success: false,
			error: Object.values(errors).flat().join(', ') || 'Invalid input',
		};
	}

	try {
		const firepit = await prisma.firepit.create({
			data: {
				name: parsed.data.name,
				description: parsed.data.description,
				latitude: parsed.data.latitude,
				longitude: parsed.data.longitude,
				city: parsed.data.city,
				pricePerDay: parsed.data.pricePerDay,
				optimalNumberOfVisitors: parsed.data.optimalNumberOfVisitors,
				createdById: session.user.id,
			},
		});

		await prisma.$executeRaw`
      UPDATE "Firepit"
      SET location = ST_SetSRID(ST_MakePoint(${parsed.data.longitude}, ${parsed.data.latitude}), 4326)
      WHERE id = ${firepit.id};
    `;

		return {
			success: true,
		};
	} catch (err: any) {
		console.error('[ERROR]', err);
		return {
			success: false,
			error: 'Something went wrong. Please try again later.',
		};
	}
};

export { createFirepit };
