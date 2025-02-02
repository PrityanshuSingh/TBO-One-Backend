const generateEmbedding = require('../embedding/generateEmbedding');
const hotelModel = require("../../models/Hotel");
const base64 = require('base-64')
const axios = require('axios');

const embedHotelFeaturesAndDescription = async (hotelList, CityCode) => {
    try {
        if (!CityCode) {
            return new Error("City Code is Mandatory");
        }
        console.log(hotelList.length, hotelList)
        if (hotelList.length === 0 || !hotelList) {
            try {

                const url = `${process.env.TBO_HOTEL_BASE_URL}/TBOHotelCodeList`
                const username = process.env.TBO_HOTEL_USERNAME;
                const password = process.env.TBO_HOTEL_PASSWORD;
                const basicAuth = base64.encode(`${username}:${password}`);
                const data = {
                    "CityCode": CityCode,
                    "IsDetailedResponse": "true"
                }
                const headers = {
                    'Content-Type': 'application/json',
                    Authorization: `Basic ${basicAuth}`,
                };
                const response = await axios.post(url, data, { headers });
                if(!response ) {
                    return new Error("No response found for the given CityCode");
                }

                console.log("response", response.data)
                if(!response.data.Hotels){
                    return;
                }
                hotelList = response.data.Hotels

            }
            catch (error) {
                throw error
            }
        }
        for (const hotel of hotelList) {

            const existingHotel = await hotelModel.findOne({HotelCode : hotel.HotelCode, CityCode});
            if(existingHotel){ 
                console.log("Existing Hotel")
                continue
            }
            let textContent = hotel.Attractions + hotel.HotelFacilities + hotel.Description + "\nRating of the hotel :" + hotel.HotelRating;

            console.log("test content", textContent);
            

            let embeddedFeature = await generateEmbedding(textContent);

            await hotelModel.findOneAndUpdate(
                { HotelCode: hotel.HotelCode },
                {
                    HotelCode: hotel.HotelCode,
                    HotelRating: hotel.HotelRating,
                    CityCode,
                    feature_embedding: embeddedFeature
                },
                { upsert: true, new: true }
            );
            console.log("Hotel Code : ", hotel.HotelCode)
        }
        console.log("Embedding Task Completed Sucessfully!!")
    } catch (error) {
        console.log("Error embedding hotels", error);
        throw error
    }
}

module.exports = embedHotelFeaturesAndDescription;


