-- Migration: Create Payment table
CREATE TABLE Payment (
    PaymentID INT AUTO_INCREMENT PRIMARY KEY,
    ReservationID INT,
    Amount FLOAT NOT NULL,
    Status VARCHAR(20) NOT NULL,             -- e.g., 'Paid', 'Pending'
    NameOnCard VARCHAR(100),
    CardNumber VARCHAR(20),                  -- Store masked only if needed
    ExpiryDate VARCHAR(7),                   -- MM/YY format
    CVV VARCHAR(4),                          -- Optional: Better to not store it for security
    PaymentMethod ENUM('Credit', 'Debit') DEFAULT 'Credit',
    FOREIGN KEY (ReservationID) REFERENCES Reservation(ReservationID)
);
