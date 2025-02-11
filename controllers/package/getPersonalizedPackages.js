const Agent = require("../../models/Agent");

exports.getPersonalizedPackages = async (req, res) => {
  try {
    const agentId = req.query.agentId;
    if (!agentId) {
      return res.status(400).json({ message: 'Agent ID is required' });
    }
    const agent = await Agent.findById(agentId)
      .populate("Profile.personalized")
      .lean();
      
    if (!agent || !agent.Profile) {
      return res.status(404).json({ message: "Agent or agent profile not found" });
    }

    const personalizedPackages = (agent.Profile.personalized || []).map((pkg) => ({
      ...pkg,
      id: pkg._id.toString(),
    }));

    res.status(200).json(personalizedPackages);
  } catch (err) {
    res.status(400).json({ message: "Error fetching personalized packages", error: err.message });
  }
};
