-- AlterTable
ALTER TABLE "admins" ALTER COLUMN "refresh_token" DROP NOT NULL;

-- AlterTable
ALTER TABLE "sales_reps" ALTER COLUMN "refresh_token" DROP NOT NULL;
