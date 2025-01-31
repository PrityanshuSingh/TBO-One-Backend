require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const findCityCode = require('./controllers/search/findCityCode')
const mongoDB = require('./config/db')
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require('cors')

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.use(express.json())


mongoDB();
app.use(cors({
    origin: "http://localhost:5173",
    methods: "GET, POST, PUT, DELETE, OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true
}));

// Handle preflight requests
app.options("*", (req, res) => {
    res.sendStatus(200);
});

app.use('/api', require('./routes'));
const generateEmbedding = require('./utils/embedding/generateEmbedding')

app.listen(5000, '0.0.0.0', () => {
    console.log('Server running on port 5000');
});