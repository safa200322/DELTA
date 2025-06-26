-- Migration: Add AccessoryName column to Accessory table
ALTER TABLE Accessory
ADD COLUMN AccessoryName VARCHAR(100);
