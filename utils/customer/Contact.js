const Contact = require('../../models/Contact');

// Create a Contact
const createContact = async (data) => {
    try {
        const contact = new Contact(data);
        await contact.save();
        return contact;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Update a Contact
const updateContact = async (id, updates) => {
    try {
        const contact = await Contact.findByIdAndUpdate(id, updates, { new: true });
        return contact;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Delete a Contact
const deleteContact = async (id) => {
    try {
        await Contact.findByIdAndDelete(id);
        return { message: 'Contact deleted successfully' };
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = { createContact, updateContact, deleteContact };
