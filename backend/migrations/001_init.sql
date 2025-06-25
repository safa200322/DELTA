CREATE TABLE IF NOT EXISTS User (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    PhoneNumber VARCHAR(15) NOT NULL UNIQUE, 
    Email VARCHAR(150) UNIQUE, -- Optional
    Date_of_birth DATE,
    Password VARCHAR(255) NOT NULL,
    NationalID VARCHAR(20) UNIQUE, 
    PassportNumber VARCHAR(20) UNIQUE
);


CREATE TABLE IF NOT EXISTS Admin (
    AdminID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    PhoneNumber VARCHAR(15) NOT NULL UNIQUE,
    Email VARCHAR(150) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL
);


CREATE TABLE IF NOT EXISTS Chauffeur (
    ChauffeurID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    PhoneNumber VARCHAR(15) NOT NULL UNIQUE,
    Email VARCHAR(150) NOT NULL UNIQUE,
    Date_of_birth DATE NOT NULL,
    LicenseNumber VARCHAR(50) NOT NULL UNIQUE,
    Availability ENUM('Available', 'Unavailable') NOT NULL DEFAULT 'Available',
    Location VARCHAR(100) NOT NULL,
    Status ENUM('Pending', 'Approved', 'Rejected') NOT NULL DEFAULT 'Pending'
   );



CREATE TABLE IF NOT EXISTS Vehicle (
    VehicleID INT AUTO_INCREMENT PRIMARY KEY,
    Type ENUM('Car', 'boats', 'Bicycle', 'Motorcycle') NOT NULL,
    Status ENUM('Available', 'Rented', 'Maintenance') NOT NULL DEFAULT 'Available',
    Location VARCHAR(100) NOT NULL,
    Price INT NOT NULL
);


CREATE TABLE IF NOT EXISTS Car (
    VehicleID INT PRIMARY KEY,
    Brand VARCHAR(50) NOT NULL,
    Model VARCHAR(50) NOT NULL,
    Year INT NOT NULL,
    FuelType ENUM('Petrol', 'Diesel', 'Electric', 'Hybrid') NOT NULL,
    Transmission ENUM('Manual', 'Automatic'),
    Seats INT NOT NULL,
    FOREIGN KEY (VehicleID) REFERENCES Vehicle(VehicleID) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS boats (
    VehicleID INT PRIMARY KEY,
    Capacity INT NOT NULL,  
    EngineType ENUM('Inboard', 'Outboard', 'Sail') NOT NULL,
    Brand VARCHAR(100) NOT NULL,
    BoatType VARCHAR(50) NOT NULL,
    FOREIGN KEY (VehicleID) REFERENCES Vehicle(VehicleID) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS Bicycle (
    VehicleID INT PRIMARY KEY,
    Type ENUM('Road', 'Mountain', 'Hybrid', 'Electric') NOT NULL,
    Gears INT NOT NULL,
    FOREIGN KEY (VehicleID) REFERENCES Vehicle(VehicleID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Motorcycle (
    VehicleID INT PRIMARY KEY,
    Brand VARCHAR(50) NOT NULL,
    Engine INT NOT NULL,  
    Year INT NOT NULL,
    color VARCHAR(10) NOT NULL,
    Type ENUM('Sport', 'Cruiser', 'Touring', 'Standard') NOT NULL,
    FOREIGN KEY (VehicleID) REFERENCES Vehicle(VehicleID) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS VehicleOwner (
    OwnerID INT AUTO_INCREMENT PRIMARY KEY,
    FullName VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL, -- store hashed passwords only!
    PhoneNumber VARCHAR(20),
    NationalID VARCHAR(30), -- optional for verification
    ProfileImage VARCHAR(255), -- optional
    Availability ENUM('Available', 'Unavailable') DEFAULT 'Available',
    TotalEarnings DECIMAL(12,2) DEFAULT 0.00,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS Maintenance (
    MaintenanceID INT AUTO_INCREMENT PRIMARY KEY,
    VehicleID INT,
    maintenance_info VARCHAR(500),
    PlannedDate DATE,
    Status ENUM( 'In Progress', 'Completed') DEFAULT 'Completed',
    FOREIGN KEY (VehicleID) REFERENCES Vehicle(VehicleID)
);


CREATE TABLE IF NOT EXISTS Accessory (
    AccessoryID INT AUTO_INCREMENT PRIMARY KEY,
    VehicleType VARCHAR(50) NOT NULL,
    Quantity INT NOT NULL,
    Price FLOAT NOT NULL
);


CREATE TABLE IF NOT EXISTS Reservation (
    ReservationID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    VehicleID INT,
    LicenseID VARCHAR(50) UNIQUE,
    ChauffeurID INT,
    StartDate DATETIME NOT NULL,
    EndDate DATETIME NOT NULL,
    PickupLocation VARCHAR(100) NOT NULL,
    DropoffLocation VARCHAR(100) NOT NULL,
    AccessoryID INT,
    FOREIGN KEY (UserID) REFERENCES User(UserID),
    FOREIGN KEY (VehicleID) REFERENCES Vehicle(VehicleID),
    FOREIGN KEY (ChauffeurID) REFERENCES Chauffeur(ChauffeurID),
    FOREIGN KEY (AccessoryID) REFERENCES Accessory(AccessoryID),
    CHECK (
        (LicenseID IS NOT NULL AND ChauffeurID IS NULL) OR 
        (ChauffeurID IS NOT NULL AND LicenseID IS NULL)
    )
);


CREATE TABLE IF NOT EXISTS Notification (
    NotificationID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    Type VARCHAR(50) NOT NULL,
    Content TEXT NOT NULL,
    Status VARCHAR(20) NOT NULL,
    FOREIGN KEY (UserID) REFERENCES User(UserID)
);


CREATE TABLE IF NOT EXISTS Payment (
    PaymentID INT AUTO_INCREMENT PRIMARY KEY,
    ReservationID INT,
    Amount FLOAT NOT NULL,
    Status VARCHAR(20) NOT NULL,
    FOREIGN KEY (ReservationID) REFERENCES Reservation(ReservationID)
);

CREATE TABLE IF NOT EXISTS Review(
    reviewID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT,
    Stars INT CHECK(Stars>=0 AND Stars<=5),
    Sentence VARCHAR(2000),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updateAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY(userID) REFERENCES User(UserID)

);

-- Track applied migrations
CREATE TABLE IF NOT EXISTS Migrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL UNIQUE,
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


