-- Migration: Create ChauffeurAssignment table
CREATE TABLE ChauffeurAssignment (
  ID INT PRIMARY KEY AUTO_INCREMENT,
  ReservationID INT NOT NULL,
  ChauffeurID INT NOT NULL,
  Status ENUM('Pending', 'Accepted', 'Rejected') DEFAULT 'Pending',
  RequestedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ReservationID) REFERENCES Reservation(ReservationID),
  FOREIGN KEY (ChauffeurID) REFERENCES Chauffeur(ChauffeurID)
);
