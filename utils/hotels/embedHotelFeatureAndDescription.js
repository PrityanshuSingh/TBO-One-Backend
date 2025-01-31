const generateEmbedding = require('../embedding/generateEmbedding');
const hotel = require("../../models/Hotel")

const embedHotelFeaturesAndDescription = async (hotelList, cityCode) => {
    try {
        hotelList.forEach(Hotel => {
            textContent = Hotel.Attractions + Hotel.HotelFacilities + Hotel.Description;
            console.log("Description : ", Hotel.description);
            console.log("Features : ", Hotel.features);
            embededFeature = generateEmbedding(textContent);

            const newHotel = new hotel({
                cityCode : hotel.cityCode
            });

        });
    } catch (error) {
        console.log("Error embedding hotels", error);
        throw error
    }
}

module.exports = embedHotelFeaturesAndDescription;


