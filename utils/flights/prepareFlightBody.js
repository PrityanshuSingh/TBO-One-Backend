const { GoogleGenerativeAI } = require("@google/generative-ai"); // Removed SchemaType
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const prepareFlightBody = async (details, prompt) => {
    try {

        const detailsString = JSON.stringify(details);

        const schema = {
            description: "Flight Search Data",
            type: "object",
            properties: {
                EndUserIp: { type: "string" },
                TokenId: { type: "string" },
                AdultCount: { type: "integer" }, // Use integer type
                ChildCount: { type: "integer" }, // Use integer type
                InfantCount: { type: "integer" }, // Use integer type
                DirectFlight: { type: "boolean" },
                OneStopFlight: { type: "boolean" },
                JourneyType: { type: "string" }, // Or "integer" if you use numbers
                PreferredAirlines: {
                    type: "array",
                    items: { type: "string" },
                    nullable: true, // Airlines can be null
                },
                Segments: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            Origin: { type: "string" },
                            Destination: { type: "string" },
                            FlightCabinClass: { type: "string" }, // Or "integer"
                            PreferredDepartureTime: { type: "string" },
                            PreferredArrivalTime: { type: "string" },
                        },
                        required: [
                            "Origin",
                            "Destination",
                            "FlightCabinClass",
                            "PreferredDepartureTime",
                            "PreferredArrivalTime",
                        ],
                    },
                },
                Sources: {
                    type: "array",
                    items: { type: "string" },
                    nullable: true,
                },
            },
            required: [
                "EndUserIp",
                "TokenId",
                "AdultCount",
                "ChildCount",
                "InfantCount",
                "DirectFlight",
                "OneStopFlight",
                "JourneyType",
                "Segments",
            ],
        };

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-pro",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });


        // const result = await model.generateContent(
        //     `Here are the given details: ${detailsString}. Your task is to prepare the fight search request body that best match with the details and prompt: ${prompt}. strictly adhare to the schema.`
        // );

        const combinedPrompt = `
        You are an AI assistant tasked with creating a JSON request body for a flight search API.  You MUST strictly adhere to the provided JSON schema.  Do not include any explanations or commentary in your response; return ONLY the valid JSON object.

        Here are the details for the flight search:

        \`\`\`json
        ${detailsString}
        \`\`\`

        Here is the user's prompt with additional search criteria:

        \`\`\`
        ${prompt}
        \`\`\`

        Based on the provided details, the user's prompt, and the JSON schema, construct the flight search request body.  Use these guidelines:

        in the Segments destination and origin use IATA CODES of the given destination and origin in the details.

        * **EndUserIp:** Use "YOUR_IP_ADDRESS" as a placeholder.
        * **TokenId:** Use "YOUR_TOKEN_ID" as a placeholder.
        * **JourneyType:**  1 - OneWay, 2 - Return, 3 - Multi Stop, 4 - AdvanceSearch, 5 - Special Return. Default is 2 (Return). If journey type is set to 2 then the Segments should contain details of both way (from x to y and again from y to x)
        * **FlightCabinClass:** 1 - All, 2 - Economy, 3 - PremiumEconomy, 4 - Business, 5 - PremiumBusiness, 6 - First. Default is 2 (Economy).
        * **PreferredDepartureTime/PreferredArrivalTime:** Format must be YYYY-MM-DDTHH:mm:ss.  If time is not specified, use 00:00:00 (midnight).

        Fill in all the required fields.  Use the details provided.  Interpret the prompt to set values for optional fields like DirectFlight, OneStopFlight, PreferredAirlines, and Sources. If the prompt does not have any information about the optional fields, use the default values specified in the schema.

        Return ONLY the valid JSON.
        `;

        const result = await model.generateContent(combinedPrompt);

        try {
            const parsedResult = JSON.parse(result.response.text());    
            return parsedResult;
        } catch (jsonError) {
            console.error("Error parsing JSON:", jsonError);
            console.error("Raw Response Text:", result.response.text());
            return null;
        }

    } catch (error) {
        console.error("Error:", error);
        return null;
    }
};

module.exports = prepareFlightBody;