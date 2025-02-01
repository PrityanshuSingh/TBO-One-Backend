const Customer = require('../../models/Customer');

// Create a Customer
const createCustomer = async (data) => {
    try {
        const newCustomer = new Customer(data);
        await newCustomer.save();
        return newCustomer;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Update a Customer
const updateCustomer = async (id, updates) => {
    try {
        const Customer = await Customer.findByIdAndUpdate(id, updates, { new: true });
        return Customer;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Delete a Customer
const deleteCustomer = async (id) => {
    try {
        await Customer.findByIdAndDelete(id);
        return { message: 'Customer deleted successfully' };
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = { createCustomer, updateCustomer, deleteCustomer };
