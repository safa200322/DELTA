-- Migration: Change ExpiryDate column to VARCHAR(20)
ALTER TABLE Payment MODIFY COLUMN ExpiryDate VARCHAR(20);
