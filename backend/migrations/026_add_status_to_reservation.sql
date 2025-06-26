-- Migration: Add Status column to Reservation table
ALTER TABLE Reservation
ADD COLUMN Status VARCHAR(50) DEFAULT 'Active';
