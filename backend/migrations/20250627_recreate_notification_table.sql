-- Migration: Drop old Notification table and create new Notification table (no RecipientID, with new BroadcastGroup values)
DROP TABLE IF EXISTS Notification;

CREATE TABLE Notification (
    NotificationID INT AUTO_INCREMENT PRIMARY KEY,
    RecipientType ENUM('User', 'Owner', 'Chauffeur', 'AdminBroadcast') NOT NULL,
    Title VARCHAR(100) NOT NULL,
    Message TEXT NOT NULL,
    Type VARCHAR(50) NOT NULL,
    IsRead BOOLEAN DEFAULT FALSE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    BroadcastGroup ENUM('Users', 'Owners', 'Chauffeurs') NULL
);
