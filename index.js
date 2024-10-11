
'use strict'
/**
 * 
 * index.js:Starting Point of Sever 
 * Developer:Santosh Dubey
 * 
 */
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
global.constants = require('./serverConstants.js');

// Middleware to enable CORS for all routes
app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());

const apiRouterPath = `/api/${constants.CODE_VERSION}`;

// GET request handler at root "/"
app.get('/health', (req, res) => {
    res.send('Server is up and Live!');
});

// Connect to MongoDB
mongoose.connect(constants.MONGODB_URI, {})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

// Define a schema for the data
const dataSchema = new mongoose.Schema({
    Name: String,
    Obj: String,
}, { timestamps: true });

// Create a model based on the schema
const Data = mongoose.model('Data', dataSchema);

// POST request to insert data
app.post(`/${apiRouterPath}/insert`, async (req, res) => {
    const { Name, Obj } = req.body;

    try {
        const newData = new Data({ Name, Obj });
        const savedData = await newData.save();
        res.status(201).json(savedData);
    } catch (err) {
        res.status(500).json({ message: 'Error saving data', error: err });
    }
});

// health
app.get(`/${apiRouterPath}/health`, async (req, res) => {
    try {
        res.status(200).json({message:'Server is up and Live'});
    } catch (err) {
        res.status(500).json({ message: 'Error in Server', error: err });
    }
});
// GET request to retrieve all data
app.get(`/${apiRouterPath}/data`, async (req, res) => {
    try {
        const allData = await Data.find();
        res.status(200).json(allData);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving data', error: err });
    }
});


// Define CORS options
const corsOptions = {
    origin:
        // "*"
        function (origin, callback) {
            console.log(constants.ALLOWED_ORIGINS.indexOf(origin), origin, constants.ALLOWED_ORIGINS)
            if (!origin || constants.ALLOWED_ORIGINS.indexOf(origin) !== -1) {
                // Allow requests with a matching origin or if origin is undefined (e.g., from server-side)
                callback(null, true);
            } else {
                // Disallow requests with origins not in the allowedOrigins 
                callback(new Error('Not allowed by CORS'));
            }
        }
};

app.use(cors(corsOptions));   // Use the CORS middleware with custom options

// Start the server
app.listen(constants.PORT, constants.LOCAL_IP, () => {
    console.log(`Server is running at http://localhost:${constants.PORT}`);
});
