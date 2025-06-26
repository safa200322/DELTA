-- Migration: Add LicenseFileUrl column to Chauffeur table
ALTER TABLE Chauffeur
ADD COLUMN LicenseFileUrl VARCHAR(255) DEFAULT NULL;
