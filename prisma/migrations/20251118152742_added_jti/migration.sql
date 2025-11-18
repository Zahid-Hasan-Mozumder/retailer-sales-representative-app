/*
  Warnings:

  - A unique constraint covering the columns `[jti]` on the table `admins` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[jti]` on the table `sales_reps` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "admins" ADD COLUMN     "jti" TEXT,
ADD COLUMN     "jti_expires_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "sales_reps" ADD COLUMN     "jti" TEXT,
ADD COLUMN     "jti_expires_at" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "admins_jti_key" ON "admins"("jti");

-- CreateIndex
CREATE UNIQUE INDEX "sales_reps_jti_key" ON "sales_reps"("jti");
