const Package = require('../../models/Package');
const getHotelDetails = require('../../utils/hotels/getHotelDetails');
const vectorSearch = require('../../utils/hotels/vectorSearch');
const geminiPromptBsedFilter = require('../../utils/sightseeing/geminniPromptBasedFilter');
const searchSightseeing = require('../../utils/sightseeing/searchSightseeing');

exports.recommendPackage = async (req, res) => {
    let package = { details: {} };
    let hotel = [];
    try {

        // Search Hotels

        const { aiPrompt: searchQuery } = req.body;
        const hotelsMatchingPrompt = await vectorSearch(searchQuery, "111558")
        console.log("Found hotels ", hotelsMatchingPrompt);

        for (const foundHotel of hotelsMatchingPrompt) {
            let details = await getHotelDetails(foundHotel.HotelCode)
            hotel.push(details);
        }
        package.details.hotel = hotel;



        // Search Sightseeing

        const tokenId = "305cc376-30af-4198-be82-55c007ffb781"
        const options = {
            cityId: req.body.destinationCityCode,
            countryCode: req.body.destinationCountryCode,
            fromDate: req.body.fromDate,
            toDate: req.body.toDate,
            adultCount: req.body.adultCount,
            childCount: req.body.childCount,
            childAge: req.body.childAge,
            preferredLanguage: req.body.preferredLanguage,
            preferredCurrency: req.body.preferredCurrency,
            isBaseCurrencyRequired: false,
            endUserIp: req.ip,
            tokenId,
            // keyWord : req.body.aiPrompt,
        };

        // console.log("options :", options)
        const foundSightseeing = await searchSightseeing(options);
        // console.log("found sight seeing ", foundSightseeing.length)

        const geminiFilteredSightseeing = await geminiPromptBsedFilter(foundSightseeing, searchQuery)
        // console.log("Gemin Filtered sight seeing ", geminiFilteredSightseeing)
        // console.log("Array ", Array.isArray(geminiFilteredSightseeing))
        const filteredSightseeingCodes = new Set(geminiFilteredSightseeing.map(item => item.SightseeingCode));
        // Filter foundSightseeing based on the codes
        const filteredSightseeing = foundSightseeing.filter(item => filteredSightseeingCodes.has(item.SightseeingCode));
        package.details.sightseeing = filteredSightseeing;


        // Search Flights


        res.status(200).json({ success: "OK", package });
    } catch (error) {
        console.log("Error ", error.message)
        res.status(400).json({ message: 'Error fetching packages', error });
    }
};