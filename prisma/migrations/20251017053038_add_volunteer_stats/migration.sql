-- CreateTable
CREATE TABLE "volunteer_stats" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalPoints" INTEGER NOT NULL DEFAULT 0,
    "eventsParticipated" INTEGER NOT NULL DEFAULT 0,
    "eventsOrganized" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "volunteer_stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "volunteer_stats_userId_key" ON "volunteer_stats"("userId");

-- AddForeignKey
ALTER TABLE "volunteer_stats" ADD CONSTRAINT "volunteer_stats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
