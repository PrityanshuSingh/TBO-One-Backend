const generateEmbedding = require('../embedding/generateEmbedding');
const hotel = require("../../models/Hotel")

const embedHotelFeaturesAndDescription = async (hotelList, CityCode) => {
    try {
        for (const hotel of hotelList) {
            let textContent = hotel.Attractions + hotel.HotelFacilities + hotel.Description + "\nRating of the hotel :" + hotel.HotelRating;

            console.log("Description:", hotel.Description);
            console.log("Features:", hotel.HotelFacilities);

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


