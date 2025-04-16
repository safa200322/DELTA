const Accessory = require('../models/Accessory');

// Create a new accessory
exports.createAccessory = async (req, res) => {
  try {
    const { name, description, price, available } = req.body;
    const accessory = await Accessory.create({ name, description, price, available });
    res.status(201).json(accessory);
  } catch (error) {
    res.status(500).json({ message: 'Error creating accessory', error });
  }
};

// Get all accessories (public)
exports.getAllAccessories = async (req, res) => {
  try {
    const accessories = await Accessory.findAll();
    res.json(accessories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching accessories', error });
  }
};

// Update accessory
exports.updateAccessory = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Accessory.update(req.body, { where: { id } });
    if (updated) {
      const updatedAccessory = await Accessory.findByPk(id);
      res.json(updatedAccessory);
    } else {
      res.status(404).json({ message: 'Accessory not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating accessory', error });
  }
};

// Delete accessory
exports.deleteAccessory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Accessory.destroy({ where: { id } });
    if (deleted) {
      res.json({ message: 'Accessory deleted successfully' });
    } else {
      res.status(404).json({ message: 'Accessory not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting accessory', error });
  }
};
