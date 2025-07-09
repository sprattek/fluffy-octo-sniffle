/*
  Warnings:

  - You are about to drop the column `resetToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `resetTokenExpiresAt` on the `User` table. All the data in the column will be lost.
  - Added the required column `createdById` to the `Firepit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Firepit` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Firepit" DROP CONSTRAINT "Firepit_ownerId_fkey";

-- AlterTable
ALTER TABLE "Firepit" ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "optimalNumberOfVisitors" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "ownerId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "resetToken",
DROP COLUMN "resetTokenExpiresAt";

-- AddForeignKey
ALTER TABLE "Firepit" ADD CONSTRAINT "Firepit_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Firepit" ADD CONSTRAINT "Firepit_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
