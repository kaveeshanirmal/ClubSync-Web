/*
  Warnings:

  - Added the required column `title` to the `Election` table without a default value. This is not possible if the table is not empty.
  - Added the required column `votingEnd` to the `Election` table without a default value. This is not possible if the table is not empty.
  - Added the required column `votingStart` to the `Election` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Candidate" ADD COLUMN     "experience" TEXT;

-- AlterTable
ALTER TABLE "Election" ADD COLUMN     "description" TEXT,
ADD COLUMN     "subtitle" TEXT,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "votingEnd" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "votingStart" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Position" ADD COLUMN     "description" TEXT;
