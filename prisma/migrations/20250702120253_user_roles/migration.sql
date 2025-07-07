-- CreateEnum
CREATE TYPE "Role" AS ENUM ('volunteer', 'clubAdmin', 'eventOrganizer', 'systemAdmin');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "image" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lastLogin" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'volunteer',
ALTER COLUMN "password" SET DEFAULT '';
