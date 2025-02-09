require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const mongoDB = require('./config/db')
const cors = require('cors');
const axios = require("axios");
const qs = require("qs");
const { createAgent, getAgent } = require('./utils/agent/agent');
const { createCustomer } = require('./utils/customer/Customer');
const embedHotelFeaturesAndDescription = require('./utils/hotels/embedHotelFeatureAndDescription');
const getAllCountryCode = require('./utils/hotels/getAllCountryCode');
const findCityCode = require('./utils/hotels/findCityCode');
const addTemplate = require('./utils/socials/template/addTemplate');
const aiSearch = require('./utils/hotels/geminiSearch');
const sendWhatsappMessage = require('./utils/socials/whatsapp/twilio/sendWhatsappMessage');
const searchFlights = require('./utils/flights/searchFlights');
const getIATACode = require('./utils/flights/getIATACode');

app.use(express.json())
    ; (async () => {
        await mongoDB();
    })()

app.use(cors({
    origin: process.env.ALLOWED_ORIGIN || '*',
    methods: "GET, POST, PUT, DELETE, OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
}));


app.options("*", (req, res) => {
    res.sendStatus(200);
});

app.use('/api', require('./routes'));

app.listen(PORT, '0.0.0.0', async () => {
    console.log(`Server running on port ${PORT}`);
    // await embedHotelFeaturesAndDescription([], "111558")
    // await embedHotelFeaturesAndDescription([], "111558")
    // const CountryCode = await getAllCountryCode()
    // for (let i = 0; i < CountryCode.length; i++) {
    //     const country = CountryCode[i];
    //     console.log("Country",country)
    //     const CityCode = await findCityCode(null, country.Code)
    //     console.log("City", CityCode)
    //     for (let j = 0; j < CityCode.length; j++) {
    //         const city = CityCode[j];
    //         if(city.Code === "111558"){
    //             continue
    //         }
    //         await embedHotelFeaturesAndDescription([], city.Code)
    //     }
    //     console.log("Citycode", CityCode)
    // }
    // aiSearch("111558","honeymoon")
    // const endUserIp = ; // Mock request object to simulate IP extraction

    // // Call the function
    // findFlights(endUserIp, tokenId, adultCount, childCount, infantCount, directFlight, oneStopFlight, journeyType, preferredAirlines, segments, sources)
    //     .then(response => console.log("Flight Search Result:", response))
    //     .catch(error => console.error("Error:", error.message));
    // const iataCode = await getIATACode(["mumbai","delhi"])
    // console.log(iataCode);
});