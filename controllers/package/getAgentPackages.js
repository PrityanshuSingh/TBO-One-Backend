const Package = require('../../models/Package');

exports.getAgentPackages = async (req, res) => {
  try {
    const packageId = req.query.id;
    let packages;
    let transformedPackages;
    if (packageId) {
      packages = await Package.findById(packageId).lean();
      transformedPackages = packages
      transformedPackages.id = transformedPackages._id
    }
    else {
      packages = await Package.find({}).lean();
      transformedPackages = packages.map(pkg => ({ ...pkg, id: pkg._id }))
    }

    res.status(200).json(transformedPackages);
  } catch (err) {
    res.status(400).json({ message: 'Error fetching packages', error: err });
  }
};