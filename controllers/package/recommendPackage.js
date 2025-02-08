const Package = require('../../models/Package');
const vectorSearch = require('../../utils/hotels/vectorSearch');

exports.recommendPackage = async (req, res) => {
    try {
        console.log("Packages requested", req.body);
        const { aiPrompt: searchQuery } = req.body;

        const hotelsMatchingPrompt = await vectorSearch(searchQuery,"111558")
        console.log("Found hotels ",hotelsMatchingPrompt);

        console.log()

        res.status(200).json({ success: "OK" });
    } catch (err) {
        res.status(400).json({ message: 'Error fetching packages', error: err });
    }
};