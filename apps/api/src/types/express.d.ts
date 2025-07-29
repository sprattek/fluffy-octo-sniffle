import { User as PrismaUser } from '@workspace/database'; // Assuming you're using Prisma

type UserData = {
	id: string;
	email: string;
	name: string | null;
};

declare global {
	namespace Express {
		interface User extends UserData {} // From Prisma schema
		interface Request {
			user?: User;
		}
	}
}
