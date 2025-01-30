const Package = require('../models/Package');

exports.getAgentPackages = async (req, res) => {
    try {
      const packages = await Package.find({ agent: req.params.agentId });
      res.status(200).json({ packages });
    } catch (err) {
      res.status(400).json({ message: 'Error fetching packages', error: err });
    }
  };