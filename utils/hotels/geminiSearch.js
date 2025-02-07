const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");
const getHotelsFromCityCode = require("./getHotelsFromCityCode");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const aiSearch = async (CityCode, prompt) => {
    try {
        const hotelList = await getHotelsFromCityCode(CityCode);

        console.log("HOtels list ", hotelList)

        // Convert hotelList array to a string representation
        const hotelListString = JSON.stringify(hotelList.slice(0,10));

        const schema = {
            description: "List of HotelCodes",
            type: SchemaType.ARRAY,
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    HotelCode: {
                        type: SchemaType.STRING,
                        description: "Code of the hotel",
                        nullable: false,
                    },
                },
                required: ["HotelCode"],
            },
        };

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-pro",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });

        const result = await model.generateContent(
            `Here are the given hotels list: ${hotelListString}. Your task is to find out the hotels that best match with the prompt: ${prompt}. You need to return the list of HotelCodes.`
        );

        console.log(result.response.text());
    } catch (error) {
        console.log("Error",error);
        
    }
}

module.exports = aiSearch;
