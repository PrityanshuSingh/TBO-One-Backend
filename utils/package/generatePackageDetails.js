const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generatePackageDetails = async (package) => {

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
        "_id": {
            "$oid": "679d505d4a4362b7ba5a536d"
        },
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
            "flights": [
                [
                    {
                        "FirstNameFormat": null,
                        "IsBookableIfSeatNotAvailable": false,
                        "IsHoldAllowedWithSSR": false,
                        "LastNameFormat": null,
                        "ResultIndex": "FLIGHT12345",
                        "Source": 3,
                        "IsLCC": true,
                        "IsRefundable": true,
                        "IsPanRequiredAtBook": false,
                        "IsPanRequiredAtTicket": false,
                        "IsPassportRequiredAtBook": false,
                        "IsPassportRequiredAtTicket": false,
                        "GSTAllowed": true,
                        "IsCouponAppilcable": true,
                        "IsGSTMandatory": false,
                        "AirlineRemark": "IndiGo operates multiple daily flights to Rajasthan destinations.",
                        "IsPassportFullDetailRequiredAtBook": false,
                        "ResultFareType": "RegularFare",
                        "Fare": {
                            "Currency": "INR",
                            "BaseFare": 8000,
                            "Tax": 2000,
                            "TaxBreakup": [
                                {
                                    "key": "GST",
                                    "value": 1800
                                },
                                {
                                    "key": "OtherTaxes",
                                    "value": 200
                                }
                            ],
                            "YQTax": 0,
                            "AdditionalTxnFeeOfrd": 0,
                            "AdditionalTxnFeePub": 0,
                            "PGCharge": 0,
                            "OtherCharges": 50,
                            "ChargeBU": [
                                {
                                    "key": "CONVENIENCECHARGE",
                                    "value": 50
                                }
                            ],
                            "Discount": 0,
                            "PublishedFare": 10050,
                            "CommissionEarned": 0,
                            "PLBEarned": 0,
                            "IncentiveEarned": 0,
                            "OfferedFare": 10050,
                            "TdsOnCommission": 0,
                            "TdsOnPLB": 0,
                            "TdsOnIncentive": 0,
                            "ServiceFee": 0,
                            "TotalBaggageCharges": 0,
                            "TotalMealCharges": 0,
                            "TotalSeatCharges": 0,
                            "TotalSpecialServiceCharges": 0
                        },
                        "FareBreakdown": [
                            {
                                "Currency": "INR",
                                "PassengerType": 1,
                                "PassengerCount": 1,
                                "BaseFare": 4000,
                                "Tax": 1000,
                                "TaxBreakUp": [
                                    {
                                        "key": "GST",
                                        "value": 900
                                    },
                                    {
                                        "key": "OtherTaxes",
                                        "value": 100
                                    }
                                ],
                                "YQTax": 0,
                                "AdditionalTxnFeeOfrd": 0,
                                "AdditionalTxnFeePub": 0,
                                "PGCharge": 0,
                                "SupplierReissueCharges": 0
                            },
                            {
                                "Currency": "INR",
                                "PassengerType": 2,
                                "PassengerCount": 1,
                                "BaseFare": 4000,
                                "Tax": 1000,
                                "TaxBreakUp": [
                                    {
                                        "key": "GST",
                                        "value": 900
                                    },
                                    {
                                        "key": "OtherTaxes",
                                        "value": 100
                                    }
                                ],
                                "YQTax": 0,
                                "AdditionalTxnFeeOfrd": 0,
                                "AdditionalTxnFeePub": 0,
                                "PGCharge": 0,
                                "SupplierReissueCharges": 0
                            }
                        ],
                        "Segments": [
                            [
                                {
                                    "Baggage": "15 KG",
                                    "CabinBaggage": "7 KG",
                                    "CabinClass": 2,
                                    "SupplierFareClass": null,
                                    "TripIndicator": 1,
                                    "SegmentIndicator": 1,
                                    "Airline": {
                                        "AirlineCode": "6E",
                                        "AirlineName": "IndiGo",
                                        "FlightNumber": "6E-123",
                                        "FareClass": "V",
                                        "OperatingCarrier": ""
                                    },
                                    "Origin": {
                                        "Airport": {
                                            "AirportCode": "DEL",
                                            "AirportName": "Indira Gandhi International Airport",
                                            "Terminal": "3",
                                            "CityCode": "DEL",
                                            "CityName": "Delhi",
                                            "CountryCode": "IN",
                                            "CountryName": "India"
                                        },
                                        "DepTime": "2025-07-01T08:00:00"
                                    },
                                    "Destination": {
                                        "Airport": {
                                            "AirportCode": "JAI",
                                            "AirportName": "Sanganer Airport",
                                            "Terminal": "1",
                                            "CityCode": "JAI",
                                            "CityName": "Jaipur",
                                            "CountryCode": "IN",
                                            "CountryName": "India"
                                        },
                                        "ArrTime": "2025-07-01T09:30:00"
                                    },
                                    "Duration": 90,
                                    "GroundTime": 0,
                                    "Mile": 0,
                                    "StopOver": false,
                                    "FlightInfoIndex": "",
                                    "StopPoint": "",
                                    "StopPointArrivalTime": null,
                                    "StopPointDepartureTime": null,
                                    "Craft": "737",
                                    "Remark": null,
                                    "IsETicketEligible": true,
                                    "FlightStatus": "Confirmed",
                                    "Status": "",
                                    "FareClassification": {
                                        "Type": ""
                                    }
                                }
                            ]
                        ],
                        "LastTicketDate": "2025-07-30",
                        "TicketAdvisory": null,
                        "FareRules": [
                            {
                                "Origin": "DEL",
                                "Destination": "JAI",
                                "Airline": "6E",
                                "FareBasisCode": "V",
                                "FareRuleDetail": "No changes allowed after booking.",
                                "FareRestriction": "Non-refundable.",
                                "FareFamilyCode": "Economy",
                                "FareRuleIndex": "FR12345"
                            }
                        ],
                        "AirlineCode": "6E",
                        "MiniFareRules": [
                            [
                                {
                                    "JourneyPoints": "DEL-JAI",
                                    "Type": "Reissue",
                                    "From": "24",
                                    "To": "72",
                                    "Unit": "HOURS",
                                    "Details": "INR 1500"
                                },
                                {
                                    "JourneyPoints": "DEL-JAI",
                                    "Type": "Reissue",
                                    "From": "72",
                                    "To": "",
                                    "Unit": "HOURS",
                                    "Details": "INR 2000"
                                },
                                {
                                    "JourneyPoints": "DEL-JAI",
                                    "Type": "Cancellation",
                                    "From": "24",
                                    "To": "72",
                                    "Unit": "HOURS",
                                    "Details": "INR 2500"
                                },
                                {
                                    "JourneyPoints": "DEL-JAI",
                                    "Type": "Cancellation",
                                    "From": "72",
                                    "To": "",
                                    "Unit": "HOURS",
                                    "Details": "INR 3500"
                                }
                            ]
                        ],
                        "ValidatingAirline": "6E",
                        "FareClassification": {
                            "Color": "lightGreen",
                            "Type": "Publish"
                        }
                    }
                ]
            ],
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
            "transport": {
                "airportTransfers": {
                    "pickup": {
                        "type": "Private Car",
                        "datetime": "2025-07-01T10:00:00Z",
                        "pickupLocation": "Jaipur International Airport",
                        "dropoffLocation": "Taj Rambagh Palace"
                    },
                    "dropoff": {
                        "type": "Private Car",
                        "datetime": "2025-07-12T12:00:00Z",
                        "pickupLocation": "Taj Rambagh Palace",
                        "dropoffLocation": "Jaipur International Airport"
                    }
                }
            },
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
            ],
            "additionalServices": {
                "travelInsurance": true,
                "visaAssistance": false,
                "specialRequests": "Vegetarian meal preferences, Extra pillows upon request"
            }
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

    Here is an example package

    ${examplePackageString}

    You are a travel agent AI.  Given the following package details, generate a detailed travel package JSON object that conforms to the provided JSON schema.  The JSON should include the package title, image URL, location, duration, descriptions, price breakdown, best time to visit, recommendation tags, notes, FAQs, and a detailed itinerary with dates and activities for each day.  Be creative and fill in the details based on the general information provided.  If specific details are not provided, make reasonable assumptions.  Return ONLY the valid JSON object. Do not include any other text or explanations.

    Package Details:

    ${packageString}

    you MUST follow the json schema:

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