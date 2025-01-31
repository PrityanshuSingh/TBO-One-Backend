const Package = require('../../models/Package');

// Create a Package
const createPackage = async (data) => {
    try {
        const newPackage = new Package(data);
        await newPackage.save();
        return newPackage;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Update a Package
const updatePackage = async (id, updates) => {
    try {
        const existingPackage = await Package.findByIdAndUpdate(id, updates, { new: true });
        return existingPackage;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Delete a Package
const deletePackage = async (id) => {
    try {
        await Package.findByIdAndDelete(id);
        return { message: 'Package deleted successfully' };
    } catch (error) {
        throw new Error(error.message);
    }
};

const getAllPackages = async (agentId) => {
    try {
        const existingPackages = await Package.findMany();
        return existingPackages
    }
    catch (error) {
        throw new Error(error.message);
    }
}

module.exports = { createPackage, updatePackage, deletePackage, getAllPackages };
