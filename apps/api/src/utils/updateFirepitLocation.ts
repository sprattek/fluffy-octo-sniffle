import { prisma } from '@workspace/database';

async function updateFirepitLocation(
	firepitId: string,
	lon: number,
	lat: number
) {
	await prisma.$executeRaw`
    UPDATE "Firepit"
    SET location = ST_SetSRID(ST_MakePoint(${lon}, ${lat}), 4326)
    WHERE id = ${firepitId};
  `;
}

export default updateFirepitLocation;
