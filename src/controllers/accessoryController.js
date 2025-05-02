const Accessory = require('../models/Accessory');
const Notification = require('../models/Notification'); // Ensure this is imported

// Create a new accessory
exports.createAccessory = async (req, res) => {
  try {
    const { name, description, price, available } = req.body;
    const accessory = await Accessory.create({ name, description, price, available });

    // Notify admin (userId = 1 assumed)
    await Notification.create({
      title: 'Accessory Added',
      message: `New accessory '${name}' was added to the system.`,
      type: 'Accessory',
      userId: 1
    });

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

      // Notify admin
      await Notification.create({
        title: 'Accessory Updated',
        message: `Accessory '${updatedAccessory.name}' has been updated.`,
        type: 'Accessory',
        userId: 1
      });

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

    // Optional: find accessory before deletion to get name
    const accessoryToDelete = await Accessory.findByPk(id);

    const deleted = await Accessory.destroy({ where: { id } });
    if (deleted) {
      // Notify admin
      await Notification.create({
        title: 'Accessory Deleted',
        message: accessoryToDelete
          ? `Accessory '${accessoryToDelete.name}' has been deleted.`
          : `Accessory with ID ${id} has been deleted.`,
        type: 'Accessory',
        userId: 1
      });

      res.json({ message: 'Accessory deleted successfully' });
    } else {
      res.status(404).json({ message: 'Accessory not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting accessory', error });
  }
};
