const Package = require('../../models/Package');
const Agent = require('../../models/Agent');

exports.savePackage = async (req, res) => {
  try {
    const { agentId, packageId } = req.body;

    const agent = await Agent.findById(agentId);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    const pkg = await Package.findById(packageId);
    if (!pkg) {
      return res.status(404).json({ error: 'Package not found' });
    }

    // Push packageId into the agent's saved array if not already present
    if (!agent.Profile.saved.includes(packageId)) {
      agent.Profile.saved.push(packageId);
      await agent.save();
    }

    // Send only the saved array as the response
    res.status(200).json(agent.Profile.saved);
  } catch (err) {
    res.status(400).json({ message: 'Error saving package', error: err.message });
  }
};

exports.unsavePackage = async (req, res) => {
  try {
    const { agentId, packageId } = req.body;

    const agent = await Agent.findById(agentId);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    if (agent.Profile.saved.some(pId => pId.toString() === packageId)) {
      agent.Profile.saved = agent.Profile.saved.filter(pId => pId.toString() !== packageId);
      await agent.save();
    }

    // Respond with the updated saved array only.
    res.status(200).json(agent.Profile.saved);
  } catch (err) {
    res.status(400).json({ message: 'Error unsaving package', error: err.message });
  }
};
