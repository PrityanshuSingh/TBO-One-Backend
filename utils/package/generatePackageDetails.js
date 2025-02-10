const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generatePackageDetails = async (package, userPrompt = "") => {

    const packageString = JSON.stringify(package);

    const schema = {
        type: "object",
        properties: {
            packageTitle: { type: "string" },
            image: { type: "string" },
            location: { type: "string" },
            duration: { type: "string" },
            shortDescription: { type: "string" },
            detailedDescription: { type: "string" },
            price: {
                type: "object",
                properties: {
                    currency: { type: "string" },
                    basePrice: { type: "integer" },
                    taxes: { type: "integer" },
                    discount: { type: "integer" },
                    totalPrice: { type: "integer" },
                },
                required: ["currency", "basePrice", "taxes", "discount", "totalPrice"],
            },
            bestTimeToVisit: { type: "string" },
            recommendationTags: {
                type: "array",
                items: { type: "string" },
            },
            notes: { type: "string" },
            faqs: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        question: { type: "string" },
                        answer: { type: "string" },
                    },
                    required: ["question", "answer"],
                },
            },
            itinerary: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        day: { type: "integer" },
                        date: { type: "string" }, // Added date format
                        activities: {
                            type: "array",
                            items: { type: "string" },
                        },
                    },
                    required: ["day", "date", "activities"],
                },
            },
        },
        required: [
            "packageTitle",
            "image",
            "location",
            "duration",
            "shortDescription",
            "detailedDescription",
            "price",
            "bestTimeToVisit",
            "recommendationTags",
            "itinerary",
            "notes",
            "faqs"
        ],
    };

    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-pro",
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: schema,
        },
    });

    const examplePackage = {
        "packageTitle": "Rajasthan Royal Heritage Tour",
        "image": "https://media.istockphoto.com/id/2150015755/photo/elephant-riders-in-amber-fort-famous-tourist-attraction-of-jaipur-india.webp?a=1&b=1&s=612x612&w=0&k=20&c=2eIrJx_4ek-Rdd6VOkoCNwqpFqnSx8pl3e7f77My_ng=",
        "location": "Rajasthan, India",
        "duration": "12 Days/11 Nights",
        "shortDescription": "Experience the grandeur of Rajasthan with visits to majestic forts, vibrant markets, and serene lakes.",
        "detailedDescription": "Immerse yourself in the rich cultural tapestry of Rajasthan. This tour takes you through the royal palaces of Jaipur, the serene lakes of Udaipur, the historic forts of Jodhpur, and the vibrant bazaars of Jaipur. Enjoy traditional Rajasthani cuisine, cultural performances, and luxurious stays in heritage hotels.",
        "price": {
            "currency": "INR",
            "basePrice": 35000,
            "taxes": 5000,
            "discount": 3000,
            "totalPrice": 37000
        },
        "details": {
            "hotel": {
                "name": "Taj Rambagh Palace",
                "address": "Rambagh, Jaipur, Rajasthan, India",
                "checkInDate": "2025-07-01",
                "checkOutDate": "2025-07-12",
                "roomType": "Deluxe Suite",
                "amenities": [
                    "WiFi",
                    "Breakfast",
                    "Spa",
                    "Swimming Pool",
                    "Free Parking"
                ]
            },
            "sightseeing": [
                {
                    "ResultIndex": 1,
                    "CityId": "110001",
                    "CityName": "Jaipur",
                    "CountryCode": "IN",
                    "FromDate": "2025-07-02T00:00:00",
                    "ToDate": "2025-07-02T00:00:00",
                    "SightseeingName": "Amber Fort and Elephant Ride",
                    "SightseeingCode": "RAJ-JAI-AMB",
                    "SightseeingTypes": [
                        "CULTURAL",
                        "ADVENTURE"
                    ],
                    "DurationDescription": [
                        {
                            "TotalDuration": "1 DAYS",
                            "Date": "2025-07-02T00:00:00"
                        }
                    ],
                    "Condition": "Includes entry tickets and guided tour. Elephant ride is optional.",
                    "ImageList": [
                        "https://media.istockphoto.com/id/1016237188/photo/indian-man-riding-on-elephant-near-amber-fort-jaipur-india.webp?a=1&b=1&s=612x612&w=0&k=20&c=2gTfPOUYDtd8LXxwL67OzONSvC7d5jY2JcTcRig5GP0="
                    ],
                    "Price": {
                        "CurrencyCode": "INR",
                        "BasePrice": 2000,
                        "Tax": 180,
                        "OtherCharges": 0,
                        "Discount": 200,
                        "PublishedPrice": 1980,
                        "PublishedPriceRoundedOff": 2000,
                        "OfferedPrice": 1800,
                        "OfferedPriceRoundedOff": 1800,
                        "AgentCommission": 400,
                        "AgentMarkUp": 0,
                        "ServiceTax": 0,
                        "TDS": 200,
                        "TCS": 0,
                        "TotalGSTAmount": 0,
                        "GST": {
                            "CGSTAmount": 0,
                            "CGSTRate": 0,
                            "CessAmount": 0,
                            "CessRate": 0,
                            "IGSTAmount": 0,
                            "IGSTRate": 18,
                            "SGSTAmount": 0,
                            "SGSTRate": 0,
                            "TaxableAmount": 0
                        }
                    },
                    "Source": 2,
                    "TourDescription": "Explore the majestic Amber Fort, a UNESCO World Heritage Site, and enjoy a traditional elephant ride to the fort entrance. The fort showcases a blend of Hindu and Mughal architectural styles.",
                    "IsPANMandatory": false
                },
                {
                    "ResultIndex": 2,
                    "CityId": "110002",
                    "CityName": "Udaipur",
                    "CountryCode": "IN",
                    "FromDate": "2025-07-05T00:00:00",
                    "ToDate": "2025-07-05T00:00:00",
                    "SightseeingName": "Lake Pichola Boat Ride",
                    "SightseeingCode": "RAJ-UDL-PICT",
                    "SightseeingTypes": [
                        "SCENIC",
                        "RELAXATION"
                    ],
                    "DurationDescription": [
                        {
                            "TotalDuration": "1 DAYS",
                            "Date": "2025-07-05T00:00:00"
                        }
                    ],
                    "Condition": "Includes boat ride tickets and refreshments.",
                    "ImageList": [
                        "https://media.istockphoto.com/id/2170158745/photo/water-boats-many-at-lake-water-for-ferry-at-morning.webp?a=1&b=1&s=612x612&w=0&k=20&c=yPkSAJQY4C5P4qJM5oiJko6R2mDHe6ysAcqzyRQQssw="
                    ],
                    "Price": {
                        "CurrencyCode": "INR",
                        "BasePrice": 1500,
                        "Tax": 135,
                        "OtherCharges": 0,
                        "Discount": 150,
                        "PublishedPrice": 1635,
                        "PublishedPriceRoundedOff": 1600,
                        "OfferedPrice": 1350,
                        "OfferedPriceRoundedOff": 1350,
                        "AgentCommission": 270,
                        "AgentMarkUp": 0,
                        "ServiceTax": 0,
                        "TDS": 150,
                        "TCS": 0,
                        "TotalGSTAmount": 0,
                        "GST": {
                            "CGSTAmount": 0,
                            "CGSTRate": 0,
                            "CessAmount": 0,
                            "CessRate": 0,
                            "IGSTAmount": 0,
                            "IGSTRate": 18,
                            "SGSTAmount": 0,
                            "SGSTRate": 0,
                            "TaxableAmount": 0
                        }
                    },
                    "Source": 2,
                    "TourDescription": "Enjoy a serene boat ride on Lake Pichola, witnessing the stunning architecture of the City Palace and Jag Mandir Island Palace.",
                    "IsPANMandatory": false
                }
            ],
            "itinerary": [
                {
                    "day": 1,
                    "date": "2025-07-01",
                    "activities": [
                        "Arrival in Jaipur",
                        "Check-in at Taj Rambagh Palace",
                        "Welcome Dinner"
                    ]
                },
                {
                    "day": 2,
                    "date": "2025-07-02",
                    "activities": [
                        "Breakfast at the hotel",
                        "Amber Fort Tour",
                        "Lunch at a local restaurant",
                        "Evening Cultural Show"
                    ]
                },
                {
                    "day": 3,
                    "date": "2025-07-03",
                    "activities": [
                        "Breakfast at the hotel",
                        "Jaipur City Tour including Hawa Mahal and City Palace",
                        "Shopping at Johari Bazaar",
                        "Dinner at a rooftop restaurant"
                    ]
                },
                {
                    "day": 4,
                    "date": "2025-07-04",
                    "activities": [
                        "Breakfast at the hotel",
                        "Transfer to Udaipur by flight/train",
                        "Check-in at Lake Palace Hotel",
                        "Evening boat ride on Lake Pichola"
                    ]
                },
                {
                    "day": 5,
                    "date": "2025-07-05",
                    "activities": [
                        "Breakfast at the hotel",
                        "Lake Pichola Boat Ride",
                        "Visit to Monsoon Palace",
                        "Dinner at the hotel"
                    ]
                },
                {
                    "day": 6,
                    "date": "2025-07-06",
                    "activities": [
                        "Breakfast at the hotel",
                        "Transfer to Jodhpur by flight/train",
                        "Check-in at Umaid Bhawan Palace",
                        "Evening at leisure"
                    ]
                },
                {
                    "day": 7,
                    "date": "2025-07-07",
                    "activities": [
                        "Breakfast at the hotel",
                        "Mehrangarh Fort Tour",
                        "Visit to Jaswant Thada",
                        "Shopping at Sardar Market",
                        "Dinner at the hotel"
                    ]
                },
                {
                    "day": 8,
                    "date": "2025-07-08",
                    "activities": [
                        "Breakfast at the hotel",
                        "Day trip to Osian",
                        "Camel Safari",
                        "Return to Jodhpur"
                    ]
                },
                {
                    "day": 9,
                    "date": "2025-07-09",
                    "activities": [
                        "Breakfast at the hotel",
                        "Transfer back to Jaipur by flight/train",
                        "Check-in at Taj Rambagh Palace",
                        "Evening at leisure"
                    ]
                },
                {
                    "day": 10,
                    "date": "2025-07-10",
                    "activities": [
                        "Breakfast at the hotel",
                        "Day at leisure",
                        "Optional activities: Hot air balloon ride, spa treatments"
                    ]
                },
                {
                    "day": 11,
                    "date": "2025-07-11",
                    "activities": [
                        "Breakfast at the hotel",
                        "Visit to Nahargarh Fort",
                        "Farewell Dinner"
                    ]
                },
                {
                    "day": 12,
                    "date": "2025-07-12",
                    "activities": [
                        "Breakfast at the hotel",
                        "Check-out and transfer to Jaipur International Airport",
                        "Departure"
                    ]
                }
            ]
        },
        "bestTimeToVisit": "October to March",
        "recommendationTags": [
            "Trending",
            "Cultural",
            "Heritage",
            "Royal",
            "Adventure",
            "Shopping",
            "Scenic"
        ],
        "notes": "Peak season prices may vary. Advance booking is recommended for flights and hotels.",
        "faqs": [
            {
                "question": "What is the best time to visit Rajasthan?",
                "answer": "The best time to visit Rajasthan is from October to March when the weather is pleasant."
            },
            {
                "question": "Are meals included in the package?",
                "answer": "Yes, breakfast is included in the hotel stays. Additional meals are available at local restaurants."
            }
        ]
    };

    const examplePackageString = JSON.stringify(examplePackage)

    const prompt = `

    You are an AI travel agent specializing in creating detailed travel packages.

    ### Example Package:
    Below is a sample travel package for reference. Use this as a learning guide for tone, structure, and details.

    ${examplePackageString}

    ---

    ### Task:
    Given the package details below, generate a **comprehensive travel package JSON** that strictly follows the provided JSON schema. The JSON **must** include:

    - **Title, Image, Location, and Duration**  
    - **Descriptions:** A compelling **short description** and a detailed **long description** that highlight key attractions, experiences, and themes of the trip.  
    - **Sightseeing & Hotels:** Incorporate sightseeing activities and hotel details into the descriptions and itinerary.  
    - **Price Breakdown:** Include currency, base price, taxes, discounts, and total price.  
    - **Best Time to Visit & Recommendations:** Suggest ideal travel seasons and relevant experience tags.  
    - **Notes & FAQs:** Provide essential tips and answer common traveler questions.  
    - **Itinerary:** A structured **day-by-day itinerary**, with each day including:
    - **Day number & date**
    - **Planned activities (linked to sightseeing & hotels)**
    - **Experiences, guided tours, and free time suggestions**  

    ### **Current Package Details:**
    Use the following package details to build the JSON output:

    ${packageString}

    ---

    ### **Instructions:**
    - **Be creative and fill in missing details** based on the general package information.
    - **The description name and everything should be related to the current package information and the user prompt : ${userPrompt}
    - **Ensure sutructural consistency** with the given example package and data consistency with the current package details.  
    - **Follow the JSON schema strictly.**  
    - **Return ONLY the JSON object.** Do not include any explanations or additional text.  

    `;


    const result = await model.generateContent(prompt);

    try {
        const parsedResult = JSON.parse(result.response.text());
        console.log(parsedResult);
        return parsedResult;
    } catch (jsonError) {
        console.error("Error parsing JSON:", jsonError);
        console.error("Raw Response Text:", result.response.text());
        return null;
    }
}
module.exports = generatePackageDetails