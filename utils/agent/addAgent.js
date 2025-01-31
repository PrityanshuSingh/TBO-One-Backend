const Agent = require('../models/Agent');

// Create an Agent
const createAgent = async (data) => {
    try {
        const agent = new Agent(data);
        await agent.save();
        return agent;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Update an Agent
const updateAgent = async (id, updates) => {
    try {
        const agent = await Agent.findByIdAndUpdate(id, updates, { new: true });
        return agent;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Delete an Agent
const deleteAgent = async (id) => {
    try {
        await Agent.findByIdAndDelete(id);
        return { message: 'Agent deleted successfully' };
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = { createAgent, updateAgent, deleteAgent };
