-- Migration: Add ChauffeurAmount column to Payment table
ALTER TABLE Payment
ADD COLUMN ChauffeurAmount FLOAT;
