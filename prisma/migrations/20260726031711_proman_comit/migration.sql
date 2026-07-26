-- CreateEnum
CREATE TYPE "Jenis" AS ENUM ('PERSONAL', 'TEAM');

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "jenis" "Jenis" NOT NULL DEFAULT 'PERSONAL';
