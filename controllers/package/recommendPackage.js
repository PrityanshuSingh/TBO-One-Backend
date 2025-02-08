const Package = require('../../models/Package');
const getHotelDetails = require('../../utils/hotels/getHotelDetails');
const vectorSearch = require('../../utils/hotels/vectorSearch');

exports.recommendPackage = async (req, res) => {
    let package = { details: {} };
    let hotel = [];
    try {
        console.log("Packages requested", req.body);
        const { aiPrompt: searchQuery } = req.body;

        const hotelsMatchingPrompt = await vectorSearch(searchQuery, "111558")
        console.log("Found hotels ", hotelsMatchingPrompt);

        for (const foundHotel of hotelsMatchingPrompt) {
            let details = await getHotelDetails(foundHotel.HotelCode)
            hotel.push(details);
        }

        package.details.hotel = hotel;
        res.status(200).json({ success: "OK", package });
    } catch (error) {
        console.log("Error ", error.message)
        res.status(400).json({ message: 'Error fetching packages', error });
    }
};