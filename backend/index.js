const express = require('express'); // Import the Express framework
const bodyParser = require('body-parser'); // Import the body-parser middleware
const cors = require('cors'); // Import the cors middleware

const { mongoose } = require('./db'); // Import the Mongoose instance from './db'
const inventoryController = require('./controllers/inventoryController');  // Import the inventoryController module

const app = express(); // Create an instance of the Express application

app.use(bodyParser.json()); // Parse incoming request bodies in JSON format
app.use(cors({ origin: "http://localhost:4200" })); // Enable Cross-Origin Resource Sharing (CORS) for requests from http://localhost:4200
app.listen(3000, () => console.log('server started at port : 3000'));  // Start the server and listen on port 3000

app.use('/inventories', inventoryController);  // Use the inventoryController for handling routes starting with '/inventories'
