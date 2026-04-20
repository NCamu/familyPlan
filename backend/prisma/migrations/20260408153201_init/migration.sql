-- CreateTable
CREATE TABLE "Slot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "day" TEXT NOT NULL,
    "startTime" INTEGER NOT NULL,
    "user" TEXT NOT NULL,
    "activity" TEXT NOT NULL,
    "weekId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Slot_day_startTime_user_weekId_key" ON "Slot"("day", "startTime", "user", "weekId");
