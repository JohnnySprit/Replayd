/*
  Warnings:

  - The primary key for the `Report` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `puuid` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
DELETE FROM "Report";

ALTER TABLE "Report" DROP CONSTRAINT "Report_pkey",
ADD COLUMN     "puuid" TEXT NOT NULL,
ADD CONSTRAINT "Report_pkey" PRIMARY KEY ("matchId", "puuid");
