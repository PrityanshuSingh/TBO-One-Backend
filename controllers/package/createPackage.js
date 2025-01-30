const Package = require('../models/Package');

// Create a new travel package
exports.createPackage = async (req, res) => {
  try {
    const { name, description, price, duration, destination, agentId } = req.body;
    const package = new Package({ name, description, price, duration, destination, agent: agentId });
    await package.save();
    res.status(201).json({ message: 'Package created successfully', package });
  } catch (err) {
    res.status(400).json({ message: 'Error creating package', error: err });
  }
};