require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const findCityCode = require('./controllers/search/findCityCode')
const mongoDB = require('./config/db')
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.use(express.json())


mongoDB();

app.post('/api2', async (req, res) => {
    console.log(req.body);

    // Stringify the body to ensure it's in the correct format for the prompt
    const prompt = `${JSON.stringify(req.body)} 

You need to convert the above order detail into a structured JSON format as per the following structure(stick completely to the given structure and avoid any human errors made in the above details):

{
  "order": {
    "id": "String",
    "state": "String",
    "billing": {
      "address": {
        "name": "String",
        "building": "String",
        "locality": "String",
        "city": "String",
        "state": "String",
        "country": "String",
        "area_code": "String"
      },
      "phone": "String",
      "name": "String",
      "email": "String",
      "created_at": "String (ISO 8601 DateTime)",
      "updated_at": "String (ISO 8601 DateTime)"
    },
    "items": [
      {
        "id": "String",
        "itemName": "String",
        "quantity": "Number"
      }
    ],
    "provider": {
      "id": "String",
      "locations": [
        {
          "id": "String"
        }
      ]
    },
    "fulfillments": [
      {
        "TAT": "String (Duration - ISO 8601)",
        "id": "String",
        "tracking": "Boolean",
        "end": {
          "contact": {
            "email": "String",
            "phone": "String"
          },
          "person": {
            "name": "String"
          },
          "location": {
            "gps": "String (Latitude,Longitude)",
            "address": {
              "name": "String",
              "building": "String",
              "locality": "String",
              "city": "String",
              "state": "String",
              "country": "String",
              "area_code": "String"
            }
          }
        },
        "type": "String"
      }
    ],
    "payment": {
      "uri": "String (URL)",
      "tl_method": "String",
      "params": {
        "amount": "String (Decimal as String)",
        "currency": "String",
        "transaction_id": "String"
      },
      "status": "String",
      "type": "String",
      "collected_by": "String",
      "buyer_app_finder_fee_type": "String",
      "buyer_app_finder_fee_amount": "String (Decimal as String)",
      "settlement_details": [
        {
          "settlement_counterparty": "String",
          "settlement_phase": "String",
          "settlement_type": "String",
          "settlement_bank_account_no": "String",
          "settlement_ifsc_code": "String",
          "settlement_timestamp": "String (ISO 8601 DateTime)",
          "beneficiary_name": "String",
          "bank_name": "String",
          "branch_name": "String"
        }
      ]
    },
    "quote": {
      "price": {
        "currency": "String",
        "value": "String (Decimal as String)"
      },
      "breakup": [
        {
          "item_id": "String",
          "item_quantity": {
            "count": "Number"
          },
          "title": "String",
          "title_type": "String",
          "price": {
            "currency": "String",
            "value": "String (Decimal as String)"
          }
        }
      ],
      "ttl": "String (ISO 8601 Duration)"
    },
    "tags": [
      {
        "code": "String",
        "list": [
          {
            "code": "String",
            "value": "String"
          }
        ]
      }
    ],
    "created_at": "String (ISO 8601 DateTime)",
    "updated_at": "String (ISO 8601 DateTime)"
  }
}


- Please return the response strictly in JSON format, with no explanation or additional text.`;

    console.log("prompt", prompt);

    try {
        const result = await model.generateContent(prompt);
        console.log("GEMINI RESPONSE:", result.response.text());

        // Remove triple backticks and extra spaces
        const cleanedResponse = result.response.text().replace(/```json|```/g, "").trim();


        // Parse the cleaned response into a valid JSON object
        const jsonResponse = JSON.parse(cleanedResponse);

        // Log the parsed JSON object
        console.log("Parsed JSON:", jsonResponse);

        jsonResponse.order.item.forEach(element => {
            console.log("item",element)
        });

        // Send the parsed JSON as the response
        res.status(200).json(jsonResponse);
    } catch (error) {
        console.error("Error generating response:", error);
        res.status(500).send('Error generating response');
    }
});


app.use('/api', require('./routes'));
const generateEmbedding = require('./utils/embedding/generateEmbedding')

app.listen(5000, '0.0.0.0', () => {
    console.log('Server running on port 5000');
});