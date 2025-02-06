const template = require('../../../models/Template')

const addTemplate = async (data) => {
    try {
        const newTemplate = await template.create(data);
        return newTemplate
    } catch (error) {
        throw error
    }
}

module.exports = addTemplate;