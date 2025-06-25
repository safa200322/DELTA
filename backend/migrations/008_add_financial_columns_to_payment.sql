-- Migration: Add financial columns to Payment table
ALTER TABLE Payment 
  ADD COLUMN TotalPrice FLOAT,
  ADD COLUMN CommissionRate FLOAT,
  ADD COLUMN CommissionAmount FLOAT,
  ADD COLUMN OwnerEarning FLOAT,
  ADD COLUMN PaidOut BOOLEAN DEFAULT 0;
