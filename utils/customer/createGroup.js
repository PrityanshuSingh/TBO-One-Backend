const Group = require('../../models/Group');

// Create a Group
const createGroup = async (data) => {
    try {
        const group = new Group(data);
        await group.save();
        return group;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Update a Group
const updateGroup = async (id, updates) => {
    try {
        const group = await Group.findByIdAndUpdate(id, updates, { new: true });
        return group;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Delete a Group
const deleteGroup = async (id) => {
    try {
        await Group.findByIdAndDelete(id);
        return { message: 'Group deleted successfully' };
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = { createGroup, updateGroup, deleteGroup };
