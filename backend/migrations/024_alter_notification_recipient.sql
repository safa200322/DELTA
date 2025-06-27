-- Migration: Drop RecipientType and add RecipientID to Notification table

ALTER TABLE Notification
  DROP COLUMN RecipientType