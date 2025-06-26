-- Migration: Drop RecipientType and add RecipientID to Notification table

ALTER TABLE Notification
  DROP COLUMN RecipientType,
  ADD COLUMN RecipientID INT NOT NULL AFTER NotificationID; -- Adjust position and type as needed
