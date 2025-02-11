const Package = require('../../models/Package');
const Campaign = require('../../models/Campaign');

exports.getPackagesByCampaign = async (req, res) => {
  try {
    const campaignId = req.query.id; 
    let packages;
    let transformedPackages;
    if (campaignId) {
      // Find the campaign using the provided campaign ID
      const campaign = await Campaign.findById(campaignId).lean();
      if (!campaign) {
        return res.status(404).json({ message: 'Campaign not found' });
      }

      const packageId = campaign.pkgId;
      packages = await Package.findById(packageId).lean();

      transformedPackages = { ...packages, id: packages._id };
    } else {
      packages = await Package.find({}).lean();
      transformedPackages = packages.map(pkg => ({ ...pkg, id: pkg._id }));
    }

    res.status(200).json(transformedPackages);
  } catch (err) {
    res.status(400).json({ message: 'Error fetching packages', error: err });
  }
};
