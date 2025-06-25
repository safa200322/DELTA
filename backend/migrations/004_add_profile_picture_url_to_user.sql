-- Migration: Add ProfilePictureUrl column to User table
ALTER TABLE User ADD COLUMN ProfilePictureUrl VARCHAR(512);
