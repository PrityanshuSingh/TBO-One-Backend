require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const findCityCode = require('./controllers/search/findCityCode')
const mongoDB = require('./config/db')
const cors = require('cors');
const { createAgent, getAgent } = require('./utils/agent/agent');
const { createCustomer } = require('./utils/customer/Customer');

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

app.listen(PORT, '0.0.0.0', async () => {
    console.log(`Server running on port ${PORT}`);
    // await createCustomer({
    //     "agentId":"679e03e65e267317b490eff6",
    //     "name": "Prityanshu Singh",
    //     "whatsApp": "+918279420073",
    //     "email": "prityanshusingh2003@gmail.com"
    // });
    console.log("Added customer")
});