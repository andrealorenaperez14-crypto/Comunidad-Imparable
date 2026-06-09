-- Crear tabla VideoProgress en Supabase
-- Ejecutar en: supabase.com → tu proyecto → SQL Editor

CREATE TABLE "VideoProgress" (
  "id"              TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "userId"          TEXT NOT NULL,
  "courseContentId" TEXT NOT NULL,
  "watchedPercent"  DOUBLE PRECISION NOT NULL DEFAULT 0,
  "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "VideoProgress_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "VideoProgress_userId_courseContentId_key" UNIQUE ("userId", "courseContentId"),
  CONSTRAINT "VideoProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
  CONSTRAINT "VideoProgress_courseContentId_fkey" FOREIGN KEY ("courseContentId") REFERENCES "CourseContent"("id") ON DELETE CASCADE
);

CREATE INDEX "VideoProgress_userId_idx" ON "VideoProgress"("userId");
CREATE INDEX "VideoProgress_courseContentId_idx" ON "VideoProgress"("courseContentId");
