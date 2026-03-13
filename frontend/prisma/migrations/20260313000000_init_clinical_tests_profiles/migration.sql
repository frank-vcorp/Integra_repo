-- IMPL-20260313-02: Catálogo Clínico y Perfiles B2B
-- ARCH-20260313-01: TestCategory, MedicalTest, MedicalProfile, ProfileTest, EventTest
-- Nota: Las tablas ya existen en la BD (aplicadas vía db push). Esta migración
-- registra formalmente el baseline. Se usa IF NOT EXISTS para idempotencia.

-- CreateEnum: GenderRestriction (para MedicalTest)
DO $$ BEGIN
  CREATE TYPE "GenderRestriction" AS ENUM ('ALL', 'MALE', 'FEMALE');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- CreateEnum: EventTestStatus (para EventTest)
DO $$ BEGIN
  CREATE TYPE "EventTestStatus" AS ENUM ('PENDING', 'COMPLETED', 'SKIPPED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- CreateTable: test_categories
CREATE TABLE IF NOT EXISTS "test_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "test_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable: medical_tests
CREATE TABLE IF NOT EXISTS "medical_tests" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "options" JSONB NOT NULL DEFAULT '[]',
    "targetGender" "GenderRestriction" NOT NULL DEFAULT 'ALL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medical_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable: medical_profiles
CREATE TABLE IF NOT EXISTS "medical_profiles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "companyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medical_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable: profile_tests (pivot MedicalProfile <-> MedicalTest)
CREATE TABLE IF NOT EXISTS "profile_tests" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "testId" TEXT NOT NULL,

    CONSTRAINT "profile_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable: event_tests (instancia transaccional de prueba en evento)
CREATE TABLE IF NOT EXISTS "event_tests" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "testId" TEXT,
    "testNameSnapshot" TEXT NOT NULL,
    "selectedOption" TEXT,
    "status" "EventTestStatus" NOT NULL DEFAULT 'PENDING',
    "performedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_tests_pkey" PRIMARY KEY ("id")
);

-- CreateUniqueIndex: medical_tests.code
CREATE UNIQUE INDEX IF NOT EXISTS "medical_tests_code_key" ON "medical_tests"("code");

-- CreateUniqueIndex: profile_tests (profileId, testId) — evita duplicados pivot
CREATE UNIQUE INDEX IF NOT EXISTS "profile_tests_profileId_testId_key" ON "profile_tests"("profileId", "testId");

-- AddForeignKey: medical_tests -> test_categories
ALTER TABLE "medical_tests" DROP CONSTRAINT IF EXISTS "medical_tests_categoryId_fkey";
ALTER TABLE "medical_tests" ADD CONSTRAINT "medical_tests_categoryId_fkey"
  FOREIGN KEY ("categoryId") REFERENCES "test_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey: medical_profiles -> companies
ALTER TABLE "medical_profiles" DROP CONSTRAINT IF EXISTS "medical_profiles_companyId_fkey";
ALTER TABLE "medical_profiles" ADD CONSTRAINT "medical_profiles_companyId_fkey"
  FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey: profile_tests -> medical_profiles
ALTER TABLE "profile_tests" DROP CONSTRAINT IF EXISTS "profile_tests_profileId_fkey";
ALTER TABLE "profile_tests" ADD CONSTRAINT "profile_tests_profileId_fkey"
  FOREIGN KEY ("profileId") REFERENCES "medical_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey: profile_tests -> medical_tests
ALTER TABLE "profile_tests" DROP CONSTRAINT IF EXISTS "profile_tests_testId_fkey";
ALTER TABLE "profile_tests" ADD CONSTRAINT "profile_tests_testId_fkey"
  FOREIGN KEY ("testId") REFERENCES "medical_tests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey: event_tests -> medical_events
ALTER TABLE "event_tests" DROP CONSTRAINT IF EXISTS "event_tests_eventId_fkey";
ALTER TABLE "event_tests" ADD CONSTRAINT "event_tests_eventId_fkey"
  FOREIGN KEY ("eventId") REFERENCES "medical_events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey: event_tests -> medical_tests (nullable)
ALTER TABLE "event_tests" DROP CONSTRAINT IF EXISTS "event_tests_testId_fkey";
ALTER TABLE "event_tests" ADD CONSTRAINT "event_tests_testId_fkey"
  FOREIGN KEY ("testId") REFERENCES "medical_tests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey: event_tests -> users (performedBy)
ALTER TABLE "event_tests" DROP CONSTRAINT IF EXISTS "event_tests_performedById_fkey";
ALTER TABLE "event_tests" ADD CONSTRAINT "event_tests_performedById_fkey"
  FOREIGN KEY ("performedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
