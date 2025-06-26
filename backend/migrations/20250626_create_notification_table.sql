-- Migration: Drop old Notification table if exists and create new Notification table
DROP TABLE IF EXISTS Notification;

CREATE TABLE Notification (
    NotificationID INT AUTO_INCREMENT PRIMARY KEY,
    RecipientType ENUM('User', 'Owner', 'Chauffeur', 'AdminBroadcast') NOT NULL,
    RecipientID INT NULL,
    Title VARCHAR(100) NOT NULL,
    Message TEXT NOT NULL,
    Type VARCHAR(50) NOT NULL,
    RelatedID INT NULL,
    IsRead BOOLEAN DEFAULT FALSE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    BroadcastGroup ENUM('AllUsers', 'AllOwners', 'AllChauffeurs') NULL
);
