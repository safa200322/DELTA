-- Migration: Drop Amount column from Payment table
ALTER TABLE Payment
DROP COLUMN Amount;
