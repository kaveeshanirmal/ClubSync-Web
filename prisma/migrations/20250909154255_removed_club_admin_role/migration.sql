/*
  Warnings:

  - The values [clubAdmin] on the enum `InquirerRole` will be removed. If these variants are still used in the database, this will fail.
  - The values [clubAdmin] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "InquirerRole_new" AS ENUM ('guest', 'volunteer');
ALTER TABLE "inquiries" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "inquiries" ALTER COLUMN "role" TYPE "InquirerRole_new" USING ("role"::text::"InquirerRole_new");
ALTER TYPE "InquirerRole" RENAME TO "InquirerRole_old";
ALTER TYPE "InquirerRole_new" RENAME TO "InquirerRole";
DROP TYPE "InquirerRole_old";
ALTER TABLE "inquiries" ALTER COLUMN "role" SET DEFAULT 'guest';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('volunteer', 'systemAdmin');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'volunteer';
COMMIT;
