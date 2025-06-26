-- Migration: Increase VehiclePic length to VARCHAR(1000)
ALTER TABLE Vehicle
MODIFY COLUMN VehiclePic VARCHAR(1000);
