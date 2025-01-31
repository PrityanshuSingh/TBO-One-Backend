const Package = require('../../models/Package');

exports.getAgentPackages = async (req, res) => {
  try {
    const packages = await Package.find({}).lean();

    const transformedPackages = packages.map(pkg => ({
      ...pkg,
      id: pkg._id,
    }));

    res.status(200).json( transformedPackages );
  } catch (err) {
    res.status(400).json({ message: 'Error fetching packages', error: err });
  }
};