-- IMPL-20260313-04: Papeleta Electrónica — serviceProfileId en Appointment
-- Permite asociar un MedicalProfile a una Cita para instanciar sus pruebas al Check-in
-- Usa IF NOT EXISTS / ON CONFLICT para idempotencia

ALTER TABLE "appointments"
  ADD COLUMN IF NOT EXISTS "serviceProfileId" TEXT;

-- FK: ON DELETE SET NULL para no romper citas si se borra el perfil
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'appointments_serviceProfileId_fkey'
  ) THEN
    ALTER TABLE "appointments"
      ADD CONSTRAINT "appointments_serviceProfileId_fkey"
      FOREIGN KEY ("serviceProfileId")
      REFERENCES "medical_profiles"("id")
      ON DELETE SET NULL
      ON UPDATE CASCADE;
  END IF;
END $$;
