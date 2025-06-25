-- Migration: Add ownerID column to vehicle table
ALTER TABLE vehicle ADD COLUMN ownerID VARCHAR(50);
