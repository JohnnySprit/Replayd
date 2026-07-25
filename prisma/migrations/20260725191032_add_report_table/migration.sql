-- CreateTable
CREATE TABLE "Report" (
    "matchId" TEXT NOT NULL,
    "gameName" TEXT NOT NULL,
    "player" JSONB NOT NULL,
    "report" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("matchId")
);
