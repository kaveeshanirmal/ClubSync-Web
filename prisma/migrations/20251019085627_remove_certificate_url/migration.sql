/*
  Warnings:

  - You are about to drop the column `certificateUrl` on the `certificates` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "certificates" DROP COLUMN "certificateUrl";

-- CreateIndex
CREATE INDEX "User_isActive_idx" ON "User"("isActive");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_lastLogin_idx" ON "User"("lastLogin");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");

-- CreateIndex
CREATE INDEX "User_emailVerified_idx" ON "User"("emailVerified");

-- CreateIndex
CREATE INDEX "User_isActive_role_idx" ON "User"("isActive", "role");

-- CreateIndex
CREATE INDEX "User_isActive_lastLogin_idx" ON "User"("isActive", "lastLogin");

-- CreateIndex
CREATE INDEX "User_isActive_createdAt_idx" ON "User"("isActive", "createdAt");

-- CreateIndex
CREATE INDEX "club_members_role_idx" ON "club_members"("role");

-- CreateIndex
CREATE INDEX "club_members_clubId_idx" ON "club_members"("clubId");
