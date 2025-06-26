-- Migration: Drop check constraint and LicenseID column from Reservation table
ALTER TABLE Reservation DROP CHECK reservation_chk_1;
ALTER TABLE Reservation DROP COLUMN LicenseID;
