/*
  Warnings:

  - The values [eventOrganizer] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `eventOrganizerId` on the `events` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "MembershipRole" AS ENUM ('member', 'president', 'secretary', 'treasurer', 'webmaster');

-- CreateEnum
CREATE TYPE "EventRole" AS ENUM ('organizer', 'participant');

-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('active', 'inactive', 'pending', 'banned');

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('volunteer', 'clubAdmin', 'systemAdmin');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'volunteer';
COMMIT;

-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_eventOrganizerId_fkey";

-- AlterTable
ALTER TABLE "event_registrations" ADD COLUMN     "eventRole" "EventRole" NOT NULL DEFAULT 'participant';

-- AlterTable
ALTER TABLE "events" DROP COLUMN "eventOrganizerId";

-- CreateTable
CREATE TABLE "club_members" (
    "id" TEXT NOT NULL,
    "clubId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "MembershipRole" NOT NULL DEFAULT 'member',
    "membershipStatus" "MembershipStatus" NOT NULL DEFAULT 'pending',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "club_members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "club_members_clubId_userId_key" ON "club_members"("clubId", "userId");

-- AddForeignKey
ALTER TABLE "club_members" ADD CONSTRAINT "club_members_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "club_members" ADD CONSTRAINT "club_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
