const Package = require('../../models/Package');
const Agent = require('../../models/Agent');
const getIATACode = require('../../utils/flights/getIATACode');
const prepareFlightBody = require('../../utils/flights/prepareFlightBody');
const searchFlights = require('../../utils/flights/searchFlights');
const getHotelDetails = require('../../utils/hotels/getHotelDetails');
const vectorSearch = require('../../utils/hotels/vectorSearch');
const generatePackageDetails = require('../../utils/package/generatePackageDetails');
const { createPackage } = require('../../utils/package/Package');
const geminiPromptBsedFilter = require('../../utils/sightseeing/geminniPromptBasedFilter');
const searchSightseeing = require('../../utils/sightseeing/searchSightseeing');
const generatePackageImage = require('../../utils/genai/generatePackageImage');

exports.recommendPackage = async (req, res) => {

    // Incoming req

    // originCountry: India
    // originCountryCode: IN
    // originCity: New Delhi, DELHI
    // originCityCode: 130443
    // destinationCountry: India
    // destinationCountryCode: IN
    // destinationCity: Mumbai, Maharashtra
    // destinationCityCode: 144306
    // fromDate: 2025-02 - 11
    // toDate: 2025-02 - 13
    // adultCount: 1
    // aiPrompt: i need a direct flight ad have one infant 

    let package = { details: {} };
    let hotel = [];
    try {
        const agentId = req.body.agentId;
        const { aiPrompt: searchQuery } = req.body;

        // Search Hotels
        try {
            const hotelsMatchingPrompt = await vectorSearch(searchQuery, req.body.destinationCityCode)
            console.log("Found hotels ", hotelsMatchingPrompt);

            for (const foundHotel of hotelsMatchingPrompt) {
                let details = await getHotelDetails(foundHotel.HotelCode)
                hotel.push(details);
            }
            package.details.hotel = hotel;
        } catch (error) {
            console.log("error finding hotel");
        }

        const tokenId = process.env.TBO_SIGHTSEEING_AND_FLIGHT_TOKEN

        // // Search Sightseeing
        try {

            // setTimeout(async () => {

            const sightseeingOptions = {
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
            const foundSightseeing = await searchSightseeing(sightseeingOptions);
            console.log("found sight seeing ", foundSightseeing.length)
            const geminiFilteredSightseeing = await geminiPromptBsedFilter(foundSightseeing, searchQuery)
            // console.log("Gemin Filtered sight seeing ", geminiFilteredSightseeing)
            // console.log("Array ", Array.isArray(geminiFilteredSightseeing))
            let filteredSightseeingCodes;
            let filteredSightseeing = [];

            if (geminiFilteredSightseeing && geminiFilteredSightseeing.length > 0) {
                console.log("Entering if");
                filteredSightseeingCodes = new Set(geminiFilteredSightseeing.map(item => item.SightseeingCode));
                if (filteredSightseeingCodes) {
                    filteredSightseeing = foundSightseeing.filter(item => filteredSightseeingCodes.has(item.SightseeingCode));
                }
            }
            // Filter foundSightseeing based on the codes
            package.details.sightseeing = filteredSightseeing && filteredSightseeing?.length > 0 ? filteredSightseeing.slice(0, 3) : foundSightseeing.slice(0, 3);
            // }, 1000);
        } catch (error) {
            console.log("Error adding sight seeing", error.message);
        }

        // Search Flights
        try {
            // const iataCodes = await getIATACode([req.body.originCity, req.body.destinationCity])
            // if(!iataCodes){
            //     return
            // }
            // const originIATACodes = iataCodes[0].IATACode;
            // const destinationIATACodes = iataCodes[1].IATACode
            // console.log("iataCodes", iataCodes)
            // const flightOptions = {
            //     EndUserIp: req.ip,
            //     tokenId,
            //     AdultCount: req.body.adultCount,
            //     ChildCount: req.body.childCount || 0,
            //     InfantCount: req.body.infantCount || 0,
            //     DirectFlight: req.body.directFlight || false,
            //     OneStopFlight: req.body.oneStopFlight || false,
            //     JourneyType: req.body.journeyType || '1',
            //     PreferredAirlines: req.body.preferredAirlines,
            //     Segments: [
            //         {
            //             "Origin": originIATACodes,
            //             "Destination": destinationIATACodes,
            //             "FlightCabinClass": "2",
            //             "PreferredDepartureTime": "2025-2-09T00: 00: 00",
            //             "PreferredArrivalTime": "2025-2-09T00: 00: 00"
            //         }
            //     ],
            //     Sources: req.body.sources
            // };

            // console.log("Flight options ", flightOptions)
            // const foundFlights = await searchFlights(flightOptions)
            // console.log("flights", foundFlights.length);   

            let flightOptions = await prepareFlightBody(req.body, searchQuery);

            flightOptions.EndUserIp = req.ip;
            flightOptions.TokenId = tokenId;
            console.log("response", flightOptions)

            const foundFlights = await searchFlights(flightOptions);

            // if(!foundFlights){
            //     return
            // }
            if (foundFlights.length > 1) {
                package.details.flights = [foundFlights[0].slice(0, 1), foundFlights[1].slice(0, 1)];
            }
            else if(foundFlights.length === 1){
                package.details.flights = [foundFlights[0].slice(0, 1)];
            }
        } catch (error) {
            console.log("Error Adding flights", error.message);
        }

        // Add package Description 
        try {
            const packageDescription = await generatePackageDetails(package, searchQuery);
            if (packageDescription) {
                const { itinerary, ...description } = packageDescription;
                if (description)
                    package = { ...package, ...description };
                if (itinerary)
                    package.details.itinerary = itinerary;
            }
        } catch (error) {
            console.log("Error generating description for the package", error.message);
        }


        // Generate Package Image
        try {
            const prompt = `Generate a captivating image for the travel package "${package.packageTitle}" located in ${req.body.destinationCity}. The package short description is: "${package.shortDescription}". Make sure to keep the image relevant to the package and use key elements from the description. Make it visually appealing and engaging. Keep it realistic and relatable to the audience. Try to avoid sky, clouds, and other generic images and do not write any text over image.`;
            package.image = await generatePackageImage(prompt);
        } catch (error) {
            console.log("Error generating image for the package", error.message);
        }



        package.type = "local";

        // console.log("Package Image", package.image);
        // console.log("Package short description", package.shortDescription);
        // console.log("Package long description", package.detailedDescription);


        const newGenPackage = await createPackage(
            package
        );

        package.id = newGenPackage._id;

        if(newGenPackage){
            console.log("Created and saved Package with id ", newGenPackage._id)
        }

        const agent = await Agent.findById(agentId);
        if (!agent) {
            return res.status(404).json({ error: 'Agent not found' });
        }

        if (!agent.Profile.personalized.includes(package.id)) {
            agent.Profile.personalized.push(package.id);
            await agent.save();
          }

        if (!Array.isArray(package)) {
            package = [package];
        }

        // package.agentId = ""
        res.status(200).json({ package, personalized: agent.Profile.personalized });
    } catch (error) {
        console.log("Error ", error.message)
        res.status(400).json({ message: 'Error fetching packages', error });
    }
};