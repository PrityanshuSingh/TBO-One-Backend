const express = require('express');
require('dotenv').config();
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const findCityCode = require('./controllers/search/findCityCode')

app.use(bodyParser.json())




app.use('/api',require('./routes'));

app.listen(async()=>{
    const match = await findCityCode("dabad","IN")
    console.log(`Server is listening on port ${PORT}`);
    
})