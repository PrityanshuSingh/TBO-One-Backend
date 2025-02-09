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
const generatePackageDetails = require('./utils/package/generatePackageDetails');
const { imageUpload } = require('./middleware/upload');
const uploadImage = require('./utils/image/uploadImage');

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

app.post('/api/ai/hostImage', imageUpload.none(), async (req, res) => {
    try {
        const { image } = req.body;
        const response = await uploadImage(image);
        console.log(response);
        res.status(200).json({ imageURL: response.secure_url })
    } catch (error) {
        console.log("Error uploading image", error.message);

    }
})

app.use('/api', require('./routes'));

app.listen(PORT, '0.0.0.0', async () => {
    console.log(`Server running on port ${PORT}`);
    // await embedHotelFeaturesAndDescription([], "111124") // banglore
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
    // await generatePackageDetails({
    //     "details": {
    //         "hotel": [
    //             {
    //                 "HotelCode": "1016337",
    //                 "HotelName": "Le Meridien",
    //                 "HotelRating": "FiveStar",
    //                 "Address": "28 Sankey Road,PO Box 174,Opposite Bangalore Golf Club,Bengaluru 560052,Karnataka PO Box 174Opposite Bangalore Golf ClubBengaluru 560052 ",
    //                 "Attractions": [
    //                     "Distances are displayed to the nearest 0.1 mile and kilometer. <br /> <p>National Gallery of Modern Art - 0.5 km / 0.3 mi <br /> Mount Carmel College - 0.7 km / 0.4 mi <br /> Indira Gandhi Musical Fountain Park - 0.8 km / 0.5 mi <br /> Jawaharlal Nehru Planetarium - 0.9 km / 0.5 mi <br /> Gandhi Bhavan - 1.4 km / 0.9 mi <br /> Race Course Road - 1.5 km / 0.9 mi <br /> Cubbon Park - 1.5 km / 1 mi <br /> Bangalore Palace - 1.6 km / 1 mi <br /> Vidhana Soudha - 1.8 km / 1.1 mi <br /> Hindustan Aeronautics Ltd. Corporate Offices - 1.9 km / 1.2 mi <br /> Freedom Park - 1.9 km / 1.2 mi <br /> M. Chinnaswamy Stadium - 2 km / 1.3 mi <br /> M.G. Road - 2.5 km / 1.6 mi <br /> Mantri Square Mall - 2.6 km / 1.6 mi <br /> Visvesvaraya Industrial and Technological Museum - 2.7 km / 1.7 mi <br /> </p><p>The preferred airport for Le Meridien Bangalore is Bengaluru (BLR-Kempegowda Intl.) - 30.3 km / 18.9 mi </p>"
    //                 ],
    //                 "CountryName": "India",
    //                 "CountryCode": "IN",
    //                 "Description": "<p>HeadLine : Near Race Course Road</p><p>Location : With a stay at Le Meridien Bangalore, you ll be centrally located in Bengaluru, a 5-minute drive from Race Course Road and 8 minutes from Bangalore Palace.  This 5-star hotel is 1.7 mi (2.8 km) from M.G. Road and 3.2 mi (5.1 km) from Lalbagh Botanical Gardens.</p><p>Rooms : Make yourself at home in one of the 197 individually furnished guestrooms, featuring iPod docking stations and LED televisions. Rooms have private balconies. Wired and wireless Internet access is complimentary, while DVD players and satellite programming provide entertainment. Bathrooms with shower/tub combinations feature deep soaking bathtubs and rainfall showerheads.</p><p>Dining : Enjoy Indian cuisine at Jashn, one of the hotel s 2 restaurants, or stay in and take advantage of the 24-hour room service. Snacks are also available at the coffee shop/café. Wrap up your day with a drink at the bar/lounge. Buffet breakfasts are available daily from 6:30 AM to 10:30 AM for a fee.</p><p>CheckIn Instructions : Extra-person charges may apply and vary depending on property policy. <br />Government-issued photo identification and a credit card, debit card, or cash deposit are required at check-in for incidental charges. <br />Special requests are subject to availability upon check-in and may incur additional charges. Special requests cannot be guaranteed. <ul>  Please note that cultural norms and guest policies may differ by country and by property. The policies listed are provided by the property. </ul></p>",
    //                 "TripAdvisorRating": "4.5",
    //                 "TripAdvisorReviewURL": "http://www.tripadvisor.com/Hotel_Review-g297628-d301623-Reviews-Le_Meridien_Bangalore-Bengaluru_Bangalore_District_Karnataka.html?m=19454",
    //                 "FaxNumber": "91-80-2226 7676",
    //                 "HotelFacilities": [
    //                     "Free newspapers in lobby",
    //                     "In-room accessibility",
    //                     "Wedding services",
    //                     "Roll-in shower",
    //                     "Accessible bathroom",
    //                     "Laundry facilities",
    //                     "Banquet hall",
    //                     "Conference space size (feet) - 15694",
    //                     "Breakfast available (surcharge)",
    //                     "Free parking nearby",
    //                     "Free RV",
    //                     " bus",
    //                     " truck parking",
    //                     "Free long-term parking",
    //                     "Spa services on site",
    //                     "Safe-deposit box at front desk",
    //                     "Outdoor seasonal pool",
    //                     "Nightclub",
    //                     "Wired Internet access - surcharge",
    //                     "Health club",
    //                     "WiFi (surcharge)",
    //                     "Sauna",
    //                     "Steam room",
    //                     "Pool sun loungers",
    //                     "Coffee shop or cafe",
    //                     "Meeting rooms",
    //                     "Tours/ticket assistance",
    //                     "Spa treatment room(s)",
    //                     "Conference space",
    //                     "Full-service spa",
    //                     "Designated smoking areas (fines apply)",
    //                     "Barbecue grill(s)",
    //                     "Airport transportation (surcharge)",
    //                     "Parking (limited spaces)",
    //                     "Pool umbrellas",
    //                     "Designated smoking areas",
    //                     "Conference center",
    //                     "Gift shops or newsstand",
    //                     "Snack bar/deli",
    //                     "Concierge services",
    //                     "Train station pickup (surcharge)",
    //                     "Hair salon",
    //                     "Luggage storage",
    //                     "Conference space size (meters) - 1458",
    //                     "Swimming pool",
    //                     "Computer station",
    //                     "Limo or Town Car service available",
    //                     "Free valet parking",
    //                     "Dry cleaning/laundry service",
    //                     "Free self parking",
    //                     "Express check-out",
    //                     "Porter/bellhop",
    //                     "Business center",
    //                     "24-hour front desk",
    //                     "Elevator/lift",
    //                     "Bar/lounge",
    //                     "Picnic area",
    //                     "Express check-in"
    //                 ],
    //                 "Map": "12.990721|77.586395",
    //                 "PhoneNumber": "91-80-2226 2233",
    //                 "PinCode": "560052",
    //                 "HotelWebsiteUrl": "http://www.starwoodhotels.com",
    //                 "CityName": "Bangalore"
    //             }
    //         ],
    //         "sightseeing": [
    //             {
    //                 "ResultIndex": 15,
    //                 "CityId": "111124",
    //                 "CityName": "Bangalore",
    //                 "CountryCode": "IN",
    //                 "FromDate": "2025-02-13T00:00:00",
    //                 "ToDate": "2025-02-13T00:00:00",
    //                 "SightseeingName": "Russell Market  - Private Shopping Tour",
    //                 "SightseeingCode": "E-E10-IN-BLR7",
    //                 "SightseeingTypes": [
    //                     "ACTIVITIES"
    //                 ],
    //                 "DurationDescription": [
    //                     {
    //                         "TotalDuration": "1 DAYS",
    //                         "Date": "2025-02-13T00:00:00"
    //                     }
    //                 ],
    //                 "Condition": "Printed voucher or E-voucher. Print and bring the voucher or show the voucher on your mobile device to enjoy the activity. ",
    //                 "ImageList": [
    //                     "https://media.activitiesbank.com/32715/ENG/B/32715_3.jpg",
    //                     "https://media.activitiesbank.com/32715/ENG/B/32715_2.jpg",
    //                     "https://media.activitiesbank.com/32715/ENG/B/32715_1.jpg",
    //                     "https://media.activitiesbank.com/32715/ENG/B/32715_4.jpg"
    //                 ],
    //                 "Price": {
    //                     "CurrencyCode": "INR",
    //                     "BasePrice": 7811.57,
    //                     "Tax": 0,
    //                     "OtherCharges": 0,
    //                     "Discount": 0,
    //                     "PublishedPrice": 7811.57,
    //                     "PublishedPriceRoundedOff": 7811.57,
    //                     "OfferedPrice": 5858.68,
    //                     "OfferedPriceRoundedOff": 5858.68,
    //                     "AgentCommission": 1952.89,
    //                     "AgentMarkUp": 0,
    //                     "ServiceTax": 0,
    //                     "TDS": 781.16,
    //                     "TCS": 0,
    //                     "TotalGSTAmount": 0,
    //                     "GST": {
    //                         "CGSTAmount": 0,
    //                         "CGSTRate": 0,
    //                         "CessAmount": 0,
    //                         "CessRate": 0,
    //                         "IGSTAmount": 0,
    //                         "IGSTRate": 18,
    //                         "SGSTAmount": 0,
    //                         "SGSTRate": 0,
    //                         "TaxableAmount": 0
    //                     }
    //                 },
    //                 "Source": 2,
    //                 "TourDescription": "Russell Market is a famous shopping market in Shivajinagar, Bangalore. Started in 1927, named after the name of Mr. T. B. Russell (the then municipal commissioner) it is one of the oldest structured markets in the city. Highlight of this market is the planned corridor, a central courtyard and a central tower with sections for vegetables, fruit, meat and poultry.<br />\n<br />\nThe current market stands exactly on the same spot as the old Cantonment or New Market. This part of Bangalore largely has remained unchanged, and you can experience the old-charm of a marketplace. The area has an old world charm to it and comes complete with sights, sounds and smells of a typical Asian bazaar. It is also a foodie's delight with sheekh kebabs, quails, mutton samosas and biryani. <br/><br/><strong>Inclusions: </strong>OTHERINCL,Guide<br>TRANSPORTINCL,Transport<br><br/><br/><strong>Exclusions: </strong>OTHERNOT,Any additional expenses which are not included or detailed in the programme.<br>",
    //                 "IsPANMandatory": true
    //             },
    //             {
    //                 "ResultIndex": 17,
    //                 "CityId": "111124",
    //                 "CityName": "Bangalore",
    //                 "CountryCode": "IN",
    //                 "FromDate": "2025-02-13T00:00:00",
    //                 "ToDate": "2025-02-13T00:00:00",
    //                 "SightseeingName": "Understanding Sikhism and Lake Ulsoor Visit - Private Tour",
    //                 "SightseeingCode": "E-E10-IN-BLR9",
    //                 "SightseeingTypes": [
    //                     "ACTIVITIES"
    //                 ],
    //                 "DurationDescription": [
    //                     {
    //                         "TotalDuration": "1 DAYS",
    //                         "Date": "2025-02-13T00:00:00"
    //                     }
    //                 ],
    //                 "Condition": "Printed voucher or E-voucher. Print and bring the voucher or show the voucher on your mobile device to enjoy the activity. ",
    //                 "ImageList": [
    //                     "https://media.activitiesbank.com/32718/ENG/B/32718_1.jpg",
    //                     "https://media.activitiesbank.com/32718/ENG/B/32718_2.jpg",
    //                     "https://media.activitiesbank.com/32718/ENG/B/32718_3.jpg",
    //                     "https://media.activitiesbank.com/32718/ENG/B/32718_5.jpg"
    //                 ],
    //                 "Price": {
    //                     "CurrencyCode": "INR",
    //                     "BasePrice": 7811.57,
    //                     "Tax": 0,
    //                     "OtherCharges": 0,
    //                     "Discount": 0,
    //                     "PublishedPrice": 7811.57,
    //                     "PublishedPriceRoundedOff": 7811.57,
    //                     "OfferedPrice": 5858.68,
    //                     "OfferedPriceRoundedOff": 5858.68,
    //                     "AgentCommission": 1952.89,
    //                     "AgentMarkUp": 0,
    //                     "ServiceTax": 0,
    //                     "TDS": 781.16,
    //                     "TCS": 0,
    //                     "TotalGSTAmount": 0,
    //                     "GST": {
    //                         "CGSTAmount": 0,
    //                         "CGSTRate": 0,
    //                         "CessAmount": 0,
    //                         "CessRate": 0,
    //                         "IGSTAmount": 0,
    //                         "IGSTRate": 18,
    //                         "SGSTAmount": 0,
    //                         "SGSTRate": 0,
    //                         "TaxableAmount": 0
    //                     }
    //                 },
    //                 "Source": 2,
    //                 "TourDescription": "The largest Sikh shrine in Bengaluru, the Sri Guru Singh Sabha, is situated on the banks of the picturesque Ulsoor Lake. The sprawling white building on the edges of the lake, is indeed a well known place on the City’s landscape. Sri Guru Singh Sabha Gurdwara at Ulsoor was built in 1943 and was inaugurated by A G Russell in 1945. It was only later in 1975, that the first floor of the Gurdwara was built.<br />\n<br />\nThe monument is known for its splendid structure - it has added to the beauty of the area and Kensington Road where it is situated, which is also popularly known as Gurdwara Road. Being the biggest Gurudwara in City, a huge gathering of Sikhs come here everyday. All the devotees are offered free meals on Sundays, in what is known as the ‘Guru Ka Langar’.<br />\n<br />\nUlsoor Lake is quite close to the happening M.G. Road of Bangalore. This lake is still quite popular amongst tourists who wish to spend a few quiet moments amidst the refreshing nature. At the lake you can go for boating. There is a boat club here which facilitate enjoyable boating experience for all the visitors.  <br />\n<br />\n<strong>Others</strong><br />\nCruise is not included in the tour.<br/><br/><strong>Inclusions: </strong>OTHERINCL,Guide<br>TRANSPORTINCL,Transport<br>ADMISSIONSINCL,Tickets<br><br/><br/><strong>Exclusions: </strong>OTHERNOT,Any additional expenses which are not included or detailed in the programme.<br>",
    //                 "IsPANMandatory": true
    //             },
    //             {
    //                 "ResultIndex": 9,
    //                 "CityId": "111124",
    //                 "CityName": "Bangalore",
    //                 "CountryCode": "IN",
    //                 "FromDate": "2025-02-13T00:00:00",
    //                 "ToDate": "2025-02-13T00:00:00",
    //                 "SightseeingName": "Lumbini Park - Private Tour",
    //                 "SightseeingCode": "E-E10-IN-BLR10",
    //                 "SightseeingTypes": [
    //                     "ACTIVITIES"
    //                 ],
    //                 "DurationDescription": [
    //                     {
    //                         "TotalDuration": "1 DAYS",
    //                         "Date": "2025-02-13T00:00:00"
    //                     }
    //                 ],
    //                 "Condition": "Printed voucher or E-voucher. Print and bring the voucher or show the voucher on your mobile device to enjoy the activity. ",
    //                 "ImageList": [
    //                     "https://media.activitiesbank.com/32719/ENG/B/32719_1.jpg",
    //                     "https://media.activitiesbank.com/32719/ENG/B/32719_2.jpg",
    //                     "https://media.activitiesbank.com/32719/ENG/B/32719_3.jpg",
    //                     "https://media.activitiesbank.com/32719/ENG/B/32719_4.jpg"
    //                 ],
    //                 "Price": {
    //                     "CurrencyCode": "INR",
    //                     "BasePrice": 7911.71,
    //                     "Tax": 0,
    //                     "OtherCharges": 0,
    //                     "Discount": 0,
    //                     "PublishedPrice": 7911.71,
    //                     "PublishedPriceRoundedOff": 7911.71,
    //                     "OfferedPrice": 5933.78,
    //                     "OfferedPriceRoundedOff": 5933.78,
    //                     "AgentCommission": 1977.93,
    //                     "AgentMarkUp": 0,
    //                     "ServiceTax": 0,
    //                     "TDS": 791.17,
    //                     "TCS": 0,
    //                     "TotalGSTAmount": 0,
    //                     "GST": {
    //                         "CGSTAmount": 0,
    //                         "CGSTRate": 0,
    //                         "CessAmount": 0,
    //                         "CessRate": 0,
    //                         "IGSTAmount": 0,
    //                         "IGSTRate": 18,
    //                         "SGSTAmount": 0,
    //                         "SGSTRate": 0,
    //                         "TaxableAmount": 0
    //                     }
    //                 },
    //                 "Source": 2,
    //                 "TourDescription": "Lumbini Park is a Splashy Getaway for Unlimited Fun &amp; Excitement. One of its kind Water-Front Leisure &amp; Eco-friendly Boating Park, The Lumbini Park, stretches over 1.5 kms along the Nagavara Lake. Unique in its concept, this absolute family entertainment park holds a capacity to entertain a crowd of over 5,000 visitors per day. A Wave pool, provision for parties &amp; get-togethers cater to the tasteful and enthusiastic public.<br />\n <br/><br/><strong>Inclusions: </strong>TRANSPORTINCL,Transport<br>ADMISSIONSINCL,Tickets<br><br/><br/><strong>Exclusions: </strong>OTHERNOT,Guide<br>OTHERNOT,Any additional expenses which are not included or detailed in the programme.<br>",
    //                 "IsPANMandatory": true
    //             }
    //         ],
    //         "flights": [
    //             [
    //                 {
    //                     "FareCombinationId": "",
    //                     "FirstNameFormat": null,
    //                     "IsBookableIfSeatNotAvailable": false,
    //                     "IsHoldAllowedWithSSR": false,
    //                     "LastNameFormat": null,
    //                     "ResultIndex": "OB2[TBO]Dc6w4okAatnDdA+Wx1EXjk1X33HC1tfRyaw5paD6xJXNJ6KnDzDCZlP21t7Utijsxxa5oVwFoxFA3cRQkjjnLeu3knaRLdQ3UxQFYojE0XSzZNowOZEdUTgNKpndPikLuZOkVQTS+8FTtQQoK/ac7GbI0yh0Vdi58G/UhriYYFTuPbGyU/k2MKQsTn0dj8HSSsI06M1CcU6CQWdm+N1FlvabN5FxzBK5M7SQjLuACBoH3YwPSN7M2vnV3ojUdjEdUdwP2xvspJYxFPdLIaC7D9dxzoNa05SOx6yLb6AbFJZzHAygNXqg0rwyroyP8qIOX4nTnAxZ9BKoG0aQMRiNm1L9EKl+ELF10lyfFxdZ6llRV0aQ+mRkyEsthysUFtadQAiEk5kgvhCq/Dh7lX3SBXt//thGe16Jgk4xRkwS1/9OAd3gKE1a5c5GqnFkyye6r39DT2VDJwFXEzu3M+zBYfu6fUfdA2Zab9juu6IqnwNyk5TUFSG1+Tsq9tl2CR+Rf1a0MrAx5dhDpmcGZ71i9g==",
    //                     "Source": 109,
    //                     "IsLCC": true,
    //                     "IsRefundable": true,
    //                     "IsPanRequiredAtBook": false,
    //                     "IsPanRequiredAtTicket": false,
    //                     "IsPassportRequiredAtBook": false,
    //                     "IsPassportRequiredAtTicket": false,
    //                     "GSTAllowed": true,
    //                     "IsCouponAppilcable": true,
    //                     "IsGSTMandatory": false,
    //                     "AirlineRemark": "test.",
    //                     "IsPassportFullDetailRequiredAtBook": false,
    //                     "ResultFareType": "RegularFare",
    //                     "Fare": {
    //                         "Currency": "INR",
    //                         "BaseFare": 9945,
    //                         "Tax": 4101,
    //                         "TaxBreakup": [
    //                             {
    //                                 "key": "K3",
    //                                 "value": 0
    //                             },
    //                             {
    //                                 "key": "YQTax",
    //                                 "value": 1950
    //                             },
    //                             {
    //                                 "key": "YR",
    //                                 "value": 225
    //                             },
    //                             {
    //                                 "key": "PSF",
    //                                 "value": 273
    //                             },
    //                             {
    //                                 "key": "UDF",
    //                                 "value": 183
    //                             },
    //                             {
    //                                 "key": "INTax",
    //                                 "value": 0
    //                             },
    //                             {
    //                                 "key": "TransactionFee",
    //                                 "value": 0
    //                             },
    //                             {
    //                                 "key": "OtherTaxes",
    //                                 "value": 1470
    //                             }
    //                         ],
    //                         "YQTax": 1950,
    //                         "AdditionalTxnFeeOfrd": 0,
    //                         "AdditionalTxnFeePub": 0,
    //                         "PGCharge": 0,
    //                         "OtherCharges": 0,
    //                         "ChargeBU": [
    //                             {
    //                                 "key": "TBOMARKUP",
    //                                 "value": 0
    //                             },
    //                             {
    //                                 "key": "GLOBALPROCUREMENTCHARGE",
    //                                 "value": 0
    //                             },
    //                             {
    //                                 "key": "CONVENIENCECHARGE",
    //                                 "value": 0
    //                             },
    //                             {
    //                                 "key": "OTHERCHARGE",
    //                                 "value": 0
    //                             }
    //                         ],
    //                         "Discount": 0,
    //                         "PublishedFare": 14046,
    //                         "CommissionEarned": 0,
    //                         "PLBEarned": 0,
    //                         "IncentiveEarned": 0,
    //                         "OfferedFare": 14046,
    //                         "TdsOnCommission": 0,
    //                         "TdsOnPLB": 0,
    //                         "TdsOnIncentive": 0,
    //                         "ServiceFee": 0,
    //                         "TotalBaggageCharges": 0,
    //                         "TotalMealCharges": 0,
    //                         "TotalSeatCharges": 0,
    //                         "TotalSpecialServiceCharges": 0
    //                     },
    //                     "FareBreakdown": [
    //                         {
    //                             "Currency": "INR",
    //                             "PassengerType": 1,
    //                             "PassengerCount": 3,
    //                             "BaseFare": 9945,
    //                             "Tax": 4101,
    //                             "TaxBreakUp": [
    //                                 {
    //                                     "key": "PSF",
    //                                     "value": 273
    //                                 },
    //                                 {
    //                                     "key": "UDF",
    //                                     "value": 183
    //                                 },
    //                                 {
    //                                     "key": "YR",
    //                                     "value": 225
    //                                 },
    //                                 {
    //                                     "key": "YQTax",
    //                                     "value": 1950
    //                                 },
    //                                 {
    //                                     "key": "OtherTaxes",
    //                                     "value": 1470
    //                                 }
    //                             ],
    //                             "YQTax": 1950,
    //                             "AdditionalTxnFeeOfrd": 0,
    //                             "AdditionalTxnFeePub": 0,
    //                             "PGCharge": 0,
    //                             "SupplierReissueCharges": 0
    //                         }
    //                     ],
    //                     "Segments": [
    //                         [
    //                             {
    //                                 "Baggage": null,
    //                                 "CabinBaggage": "7 Kg",
    //                                 "CabinClass": 2,
    //                                 "SupplierFareClass": null,
    //                                 "TripIndicator": 1,
    //                                 "SegmentIndicator": 1,
    //                                 "Airline": {
    //                                     "AirlineCode": "QP",
    //                                     "AirlineName": "Akasa Air",
    //                                     "FlightNumber": "1350",
    //                                     "FareClass": "V3",
    //                                     "OperatingCarrier": ""
    //                                 },
    //                                 "NoOfSeatAvailable": 18,
    //                                 "Origin": {
    //                                     "Airport": {
    //                                         "AirportCode": "DEL",
    //                                         "AirportName": "Indira Gandhi Airport",
    //                                         "Terminal": "T2",
    //                                         "CityCode": "DEL",
    //                                         "CityName": "Delhi",
    //                                         "CountryCode": "IN",
    //                                         "CountryName": "India"
    //                                     },
    //                                     "DepTime": "2025-02-11T21:20:00"
    //                                 },
    //                                 "Destination": {
    //                                     "Airport": {
    //                                         "AirportCode": "BLR",
    //                                         "AirportName": "Bengaluru Intl",
    //                                         "Terminal": "T1",
    //                                         "CityCode": "BLR",
    //                                         "CityName": "Bangalore",
    //                                         "CountryCode": "IN",
    //                                         "CountryName": "India"
    //                                     },
    //                                     "ArrTime": "2025-02-11T23:55:00"
    //                                 },
    //                                 "Duration": 155,
    //                                 "GroundTime": 0,
    //                                 "Mile": 0,
    //                                 "StopOver": false,
    //                                 "FlightInfoIndex": "",
    //                                 "StopPoint": "",
    //                                 "StopPointArrivalTime": "0001-01-01T00:00:00",
    //                                 "StopPointDepartureTime": "0001-01-01T00:00:00",
    //                                 "Craft": "7MZ",
    //                                 "Remark": null,
    //                                 "IsETicketEligible": true,
    //                                 "FlightStatus": "Confirmed",
    //                                 "Status": "",
    //                                 "FareClassification": {
    //                                     "Type": ""
    //                                 }
    //                             }
    //                         ]
    //                     ],
    //                     "LastTicketDate": null,
    //                     "TicketAdvisory": null,
    //                     "FareRules": [
    //                         {
    //                             "Origin": "DEL",
    //                             "Destination": "BLR",
    //                             "Airline": "QP",
    //                             "FareBasisCode": "V9O7NBIX",
    //                             "FareRuleDetail": "",
    //                             "FareRestriction": "",
    //                             "FareFamilyCode": "",
    //                             "FareRuleIndex": ""
    //                         }
    //                     ],
    //                     "AirlineCode": "QP",
    //                     "ValidatingAirline": "QP",
    //                     "FareClassification": {
    //                         "Color": "lightBlue",
    //                         "Type": "Publish"
    //                     }
    //                 }
    //             ]
    //         ]
    //     }
    // })
});
