import { User as PrismaUser } from '@workspace/database'; // Assuming you're using Prisma

declare global {
	namespace Express {
		interface User extends PrismaUser {} // From Prisma schema
		interface Request {
			user?: User;
		}
	}
}
