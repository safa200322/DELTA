-- Migration: Change TotalPrice column to DECIMAL(10,2)
ALTER TABLE Payment MODIFY COLUMN TotalPrice DECIMAL(10,2);
