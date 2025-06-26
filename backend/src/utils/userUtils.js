const userModel = require('../models/userModel');
const adminModel = require('../models/adminModel');
const chauffeurModel = require('../models/chauffeurModel');
const vehicleOwnerModel = require('../models/vehicleOwnerModel');
const bcrypt = require('bcryptjs');

/**
 * Unified user lookup function that searches across all user types
 * @param {string|number} identifier - Can be phone number, email, or ID
 * @param {string} searchType - 'phone', 'email', or 'id'
 * @returns {Object|null} - User object with type and standardized fields, or null if not found
 */
const findUserAcrossTypes = async (identifier, searchType = 'phone') => {
  try {
    // Define search functions for each user type
    const searchFunctions = {
      phone: {
        admin: () => adminModel.findByPhone(identifier),
        chauffeur: () => chauffeurModel.findByPhone(identifier),
        vehicleOwner: () => vehicleOwnerModel.getOwnerByPhone(identifier),
        user: () => userModel.findByPhone(identifier)
      },
      email: {
        admin: () => adminModel.findByEmail?.(identifier),
        chauffeur: () => chauffeurModel.findByEmail?.(identifier),
        vehicleOwner: () => vehicleOwnerModel.getOwnerByEmail?.(identifier),
        user: () => userModel.findByEmail(identifier)
      },
      id: {
        admin: () => adminModel.findById?.(identifier),
        chauffeur: () => chauffeurModel.findById?.(identifier),
        vehicleOwner: () => vehicleOwnerModel.getOwnerById?.(identifier),
        user: () => userModel.findById(identifier)
      }
    };

    const searches = searchFunctions[searchType];
    if (!searches) {
      throw new Error(`Invalid search type: ${searchType}`);
    }

    // Check Admin
    const admin = await searches.admin();
    if (admin && admin.Password) {
      return {
        ...admin,
        id: admin.AdminID,
        name: admin.Name,
        phone: admin.PhoneNumber,
        email: admin.Email,
        password: admin.Password,
        type: 'admin',
        role: 'admin',
        tableName: 'Admin',
        idField: 'AdminID'
      };
    }

    // Check Chauffeur
    const chauffeur = await searches.chauffeur();
    if (chauffeur && chauffeur.Password) {
      return {
        ...chauffeur,
        id: chauffeur.ChauffeurID,
        name: chauffeur.Name,
        phone: chauffeur.PhoneNumber,
        email: chauffeur.Email,
        password: chauffeur.Password,
        type: 'chauffeur',
        role: 'chauffeur',
        tableName: 'Chauffeur',
        idField: 'ChauffeurID'
      };
    }

    // Check Vehicle Owner
    const vehicleOwner = await searches.vehicleOwner();
    if (vehicleOwner && vehicleOwner.PasswordHash) {
      return {
        ...vehicleOwner,
        id: vehicleOwner.OwnerID,
        name: vehicleOwner.FullName,
        phone: vehicleOwner.PhoneNumber,
        email: vehicleOwner.Email,
        password: vehicleOwner.PasswordHash,
        type: 'vehicle-owner',
        role: 'vehicle-owner',
        tableName: 'vehicleowner',
        idField: 'OwnerID'
      };
    }

    // Check Regular User
    const user = await searches.user();
    if (user && user.Password) {
      return {
        ...user,
        id: user.UserID,
        name: user.Name,
        phone: user.PhoneNumber,
        email: user.Email,
        password: user.Password,
        type: 'user',
        role: 'user',
        tableName: 'User',
        idField: 'UserID',
        profilePictureUrl: user.ProfilePictureUrl
      };
    }

    return null;
  } catch (error) {
    console.error('Error in findUserAcrossTypes:', error);
    throw error;
  }
};

/**
 * Verify password for any user type
 * @param {string} plainPassword - Plain text password to verify
 * @param {Object} user - User object from findUserAcrossTypes
 * @returns {boolean} - True if password matches
 */
const verifyPassword = async (plainPassword, user) => {
  return await bcrypt.compare(plainPassword, user.password);
};

/**
 * Update password for any user type
 * @param {Object} user - User object from findUserAcrossTypes
 * @param {string} hashedPassword - New hashed password
 * @returns {boolean} - True if update was successful
 */
const updatePassword = async (user, hashedPassword) => {
  const db = require('../db');
  
  const passwordField = user.type === 'vehicle-owner' ? 'PasswordHash' : 'Password';
  
  const query = `UPDATE ${user.tableName} SET ${passwordField} = ? WHERE ${user.idField} = ?`;
  const [result] = await db.execute(query, [hashedPassword, user.id]);
  
  return result.affectedRows > 0;
};

/**
 * Delete user account for any user type
 * @param {Object} user - User object from findUserAcrossTypes
 * @returns {boolean} - True if deletion was successful
 */
const deleteUser = async (user) => {
  const db = require('../db');
  
  const query = `DELETE FROM ${user.tableName} WHERE ${user.idField} = ?`;
  const [result] = await db.execute(query, [user.id]);
  
  return result.affectedRows > 0;
};

/**
 * Update user profile for any user type
 * @param {Object} user - User object from findUserAcrossTypes
 * @param {Object} profileData - Profile data to update (name, email, phone)
 * @returns {boolean} - True if update was successful
 */
const updateUserProfile = async (user, profileData) => {
  const db = require('../db');
  
  const { name, email, phone } = profileData;
  
  // Define field mappings for each user type
  const fieldMappings = {
    admin: { name: 'Name', email: 'Email', phone: 'PhoneNumber' },
    chauffeur: { name: 'Name', email: 'Email', phone: 'PhoneNumber' },
    'vehicle-owner': { name: 'FullName', email: 'Email', phone: 'PhoneNumber' },
    user: { name: 'Name', email: 'Email', phone: 'PhoneNumber' }
  };
  
  const fields = fieldMappings[user.type];
  if (!fields) {
    throw new Error(`Unknown user type: ${user.type}`);
  }
  
  const updateFields = [];
  const updateValues = [];
  
  if (name) {
    updateFields.push(`${fields.name} = ?`);
    updateValues.push(name);
  }
  if (email) {
    updateFields.push(`${fields.email} = ?`);
    updateValues.push(email);
  }
  if (phone) {
    updateFields.push(`${fields.phone} = ?`);
    updateValues.push(phone);
  }
  
  if (updateFields.length === 0) {
    return false; // No fields to update
  }
  
  updateValues.push(user.id);
  
  const query = `UPDATE ${user.tableName} SET ${updateFields.join(', ')} WHERE ${user.idField} = ?`;
  const [result] = await db.execute(query, updateValues);
  
  return result.affectedRows > 0;
};

/**
 * Update profile picture for any user type
 * @param {Object} user - User object from findUserAcrossTypes
 * @param {string} profilePictureUrl - New profile picture URL
 * @returns {boolean} - True if update was successful
 */
const updateProfilePicture = async (user, profilePictureUrl) => {
  const db = require('../db');
  
  // Define profile picture field for each user type
  const profilePictureFields = {
    admin: 'ProfilePictureUrl', // Assuming this exists or will be added
    chauffeur: 'ProfilePictureUrl', // Assuming this exists or will be added
    'vehicle-owner': 'ProfileImage',
    user: 'ProfilePictureUrl'
  };
  
  const pictureField = profilePictureFields[user.type];
  if (!pictureField) {
    throw new Error(`Profile picture not supported for user type: ${user.type}`);
  }
  
  const query = `UPDATE ${user.tableName} SET ${pictureField} = ? WHERE ${user.idField} = ?`;
  const [result] = await db.execute(query, [profilePictureUrl, user.id]);
  
  return result.affectedRows > 0;
};

module.exports = {
  findUserAcrossTypes,
  verifyPassword,
  updatePassword,
  deleteUser,
  updateUserProfile,
  updateProfilePicture
};
