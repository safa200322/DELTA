-- Migration: Change ExpiryDate column to VARCHAR(10)
ALTER TABLE Payment MODIFY COLUMN ExpiryDate VARCHAR(10);
