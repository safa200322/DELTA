-- Migration to increase PaymentMethod column length
ALTER TABLE Payment MODIFY COLUMN PaymentMethod VARCHAR(20);
