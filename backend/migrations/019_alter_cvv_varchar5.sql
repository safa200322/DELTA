-- Migration: Change CVV column to VARCHAR(5)
ALTER TABLE Payment MODIFY COLUMN CVV VARCHAR(5);
