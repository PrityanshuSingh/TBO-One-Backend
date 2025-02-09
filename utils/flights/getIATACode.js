const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getIATACode = async (CityNames) => {
    try {

        if (!Array.isArray(CityNames)) {
            CityNames = [CityNames];
        }

        const cityListString = JSON.stringify(CityNames);

        const schema = {
            description: "List of HotelCodes",
            type: SchemaType.ARRAY,
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    IATACode: {
                        type: SchemaType.STRING,
                        description: "IATA Code of the city",
                        nullable: false,
                    },
                    CityName: {
                        type: SchemaType.STRING,
                        description: "Name of teh city",
                        nullable: false,
                    }
                },
                required: ["CityName", "IATACode"],
            }
        };

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-pro",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });

        const result = await model.generateContent(
            `Here are the given city name: ${cityListString}. Your task is to find out the IATA Codes of every city. You need to return the object according to the schema.`
        );

        return JSON.parse(result.response.text());
    } catch (error) {
        console.log("Error", error);

    }
}

module.exports = getIATACode;
