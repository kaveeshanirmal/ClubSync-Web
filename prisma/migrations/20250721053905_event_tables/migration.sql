-- AlterTable
ALTER TABLE "events" ADD COLUMN     "subtitle" TEXT;

-- CreateTable
CREATE TABLE "event_addons" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "receivables" TEXT[],
    "requirements" TEXT[],
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_addons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_agenda" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "agendaTitle" TEXT NOT NULL,
    "agendaDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_agenda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_resource_persons" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "designation" TEXT,
    "about" TEXT,
    "profileImg" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_resource_persons_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "event_addons" ADD CONSTRAINT "event_addons_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_agenda" ADD CONSTRAINT "event_agenda_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_resource_persons" ADD CONSTRAINT "event_resource_persons_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
