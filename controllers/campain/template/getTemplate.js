// controllers/campaignController.js
const Template = require('../../../models/Template');

// Create a new campaign
exports.getTemplate = async (req, res) => {
    try {
        const template = await Template.find();

        const updatedTemplate = template.map(temp => {

            return { id: temp._id, ...temp.toObject(), _id: undefined };
        });
        res.status(201).json(updatedTemplate);
    } catch (err) {
        res.status(400).json({ message: 'Error creating campaign', error: err });
    }
};
