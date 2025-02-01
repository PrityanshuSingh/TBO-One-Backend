const Agent = require('../../models/Agent');
const Group = require('../../models/Group');
const Customer = require('../../models/Customer');
const Campaign = require('../../models/Campaign');
const bcrypt = require('bcryptjs');
// Create an Agent
const createAgent = async (data) => {
    try {
        let password = data.password;
        if (!password) {
            throw new Error("Password is required.")
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        data.password = hashedPassword
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

const getAgent = async (query) => {
    try {

        const agent = await Agent.findOne(query);

        // If the agent is not found, throw an error
        if (!agent) {
            throw new Error('Agent not found');
        }

        console.log("Agent id", agent._id)

        // Fetch the related customers, filtering out invalid references
        const customers = await Customer.find({
            agentId: agent._id
        }).lean();

        // Fetch the related groups, filtering out invalid references
        const groups = await Group.find({
            agentId: agent._id
        }).lean();

        // Fetch the related campaigns, filtering out invalid references
        const campaigns = await Campaign.find({
            agentId: agent._id
        }).lean();

        // Function to remove _id and convert it to id
        const removeId = (data) => {
            return data.map(item => {
                const { _id, ...rest } = item;
                return { id: _id.toString(), ...rest }; // Convert _id to id and return the rest of the fields
            });
        };

        // Remove _id and convert it to id for each related data
        const cleanedCustomers = removeId(customers);
        const cleanedGroups = removeId(groups);
        const cleanedCampaigns = removeId(campaigns);

        const { _id, ...agentWithoutId } = agent.toObject();
        agentWithoutId.id = _id.toString(); // Convert agent's _id to id

        // Attach the cleaned results to the agent object
        agentWithoutId.customers = cleanedCustomers;
        agentWithoutId.groups = cleanedGroups;
        agentWithoutId.campaigns = cleanedCampaigns;

        // Return the updated agent data with valid customers, groups, and campaigns
        return agentWithoutId;
    } catch (error) {
        throw new Error(error.message);
    }
};


module.exports = { createAgent, updateAgent, deleteAgent, getAgent };
