-- CreateEnum
CREATE TYPE "JoinRequestStatus" AS ENUM ('pendingReview', 'interviewPending', 'approved', 'declined');

-- AlterTable
ALTER TABLE "Club" ADD COLUMN     "interviewScheduleUrl" TEXT;

-- CreateTable
CREATE TABLE "join_requests" (
    "id" TEXT NOT NULL,
    "clubId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "motivation" TEXT,
    "relevantSkills" TEXT[],
    "socialLinks" TEXT[],
    "status" "JoinRequestStatus" NOT NULL DEFAULT 'pendingReview',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "join_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "join_requests_clubId_userId_key" ON "join_requests"("clubId", "userId");

-- AddForeignKey
ALTER TABLE "join_requests" ADD CONSTRAINT "join_requests_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "join_requests" ADD CONSTRAINT "join_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
