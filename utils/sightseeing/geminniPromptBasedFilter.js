const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const geminiPromptBsedFilter = async (arrayList, prompt) => {
    try {
        const arrayListString = JSON.stringify(arrayList);

        const schema = {
            "description": "Array of Sightseeing details",
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "SightseeingCode": { "type": "string" },
                    "SightseeingName": { "type": "string" },
                    "SightseeingActivities": {
                        "type": "array",
                        "items": { "type": "string" }
                    }
                },
                "required": [
                    "SightseeingCode",
                    "SightseeingName",
                    "SightseeingActivities"
                ]
            }
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-pro",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        })

        const result = await model.generateContent(
            `Here are the given list: ${arrayListString}. Your task is to filter and return a new list with exactly same elements that best match with the prompt: ${prompt}. Consider you self as an expert in planning travel packages so you can return the combinations of sight seeing that people often prefer. You need to return the list without making change in any of the existing elements you can only choose to include or not.`
        );

        return JSON.parse(result.response.text());

    } catch (error) {
        console.log("Error", error);

    }
}

module.exports = geminiPromptBsedFilter;
