const MaintenanceModel = require('../models/maintenanceModel');
const VehicleOwnerModel = require('../models/vehicleOwnerModel');

exports.getVehicleMaintenance = async (req, res) => {
  try {
    const vehicleId = req.params.vehicleId;
    const ownerId = req.user.id;

    // Verify the vehicle belongs to the owner
    const vehicle = await VehicleOwnerModel.getVehiclesByOwner(ownerId);
    const ownedVehicle = vehicle.find(v => v.VehicleID == vehicleId);
    
    if (!ownedVehicle) {
      return res.status(403).json({ message: 'Vehicle not found or unauthorized' });
    }

    const maintenanceRecords = await MaintenanceModel.getMaintenanceByVehicleId(vehicleId);
    res.json(maintenanceRecords);
  } catch (error) {
    console.error('Error fetching vehicle maintenance:', error);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
};

exports.addMaintenance = async (req, res) => {
  try {
    const vehicleId = req.params.vehicleId;
    const ownerId = req.user.id;
    const { maintenance_info, PlannedDate, Status = 'In Progress' } = req.body;

    // Verify the vehicle belongs to the owner
    const vehicles = await VehicleOwnerModel.getVehiclesByOwner(ownerId);
    const ownedVehicle = vehicles.find(v => v.VehicleID == vehicleId);
    
    if (!ownedVehicle) {
      return res.status(403).json({ message: 'Vehicle not found or unauthorized' });
    }

    if (!maintenance_info) {
      return res.status(400).json({ message: 'Maintenance info is required' });
    }

    const maintenanceData = {
      VehicleID: vehicleId,
      maintenance_info,
      PlannedDate,
      Status
    };

    const result = await MaintenanceModel.createMaintenance(maintenanceData);
    
    res.status(201).json({
      message: 'Maintenance record created successfully',
      maintenanceId: result.insertId
    });
  } catch (error) {
    console.error('Error adding maintenance:', error);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
};

exports.getOwnerVehiclesMaintenance = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const maintenanceRecords = await MaintenanceModel.getMaintenanceByOwnerId(ownerId);
    res.json(maintenanceRecords);
  } catch (error) {
    console.error('Error fetching owner maintenance records:', error);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
};

exports.updateMaintenance = async (req, res) => {
  try {
    const maintenanceId = req.params.maintenanceId;
    const ownerId = req.user.id;
    const { maintenance_info, PlannedDate, Status } = req.body;

    // Verify the maintenance record belongs to a vehicle owned by this owner
    const maintenance = await MaintenanceModel.getMaintenanceById(maintenanceId);
    if (!maintenance) {
      return res.status(404).json({ message: 'Maintenance record not found' });
    }

    const vehicles = await VehicleOwnerModel.getVehiclesByOwner(ownerId);
    const ownedVehicle = vehicles.find(v => v.VehicleID == maintenance.VehicleID);
    
    if (!ownedVehicle) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await MaintenanceModel.updateMaintenance(maintenanceId, {
      maintenance_info,
      PlannedDate,
      Status
    });

    res.json({ message: 'Maintenance record updated successfully' });
  } catch (error) {
    console.error('Error updating maintenance:', error);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
};

exports.deleteMaintenance = async (req, res) => {
  try {
    const maintenanceId = req.params.maintenanceId;
    const ownerId = req.user.id;

    // Verify the maintenance record belongs to a vehicle owned by this owner
    const maintenance = await MaintenanceModel.getMaintenanceById(maintenanceId);
    if (!maintenance) {
      return res.status(404).json({ message: 'Maintenance record not found' });
    }

    const vehicles = await VehicleOwnerModel.getVehiclesByOwner(ownerId);
    const ownedVehicle = vehicles.find(v => v.VehicleID == maintenance.VehicleID);
    
    if (!ownedVehicle) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await MaintenanceModel.deleteMaintenance(maintenanceId);
    res.json({ message: 'Maintenance record deleted successfully' });
  } catch (error) {
    console.error('Error deleting maintenance:', error);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
};
