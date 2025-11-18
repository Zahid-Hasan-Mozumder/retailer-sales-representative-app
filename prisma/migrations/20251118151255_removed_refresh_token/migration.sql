/*
  Warnings:

  - You are about to drop the column `refresh_token` on the `admins` table. All the data in the column will be lost.
  - You are about to drop the column `refresh_token` on the `sales_reps` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "admins" DROP COLUMN "refresh_token";

-- AlterTable
ALTER TABLE "sales_reps" DROP COLUMN "refresh_token";
