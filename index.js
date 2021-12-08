// Create express app
const express = require('express');
const app = express();

// Include environment variables
require('dotenv').config()

const cors = require('cors');

const port = process.env.PORT || 5000;

// Include and use routes
const routes = require('./routes/routes.js');
app.use(express.json());
app.use('/api', routes);

// Use cors; allow requests from all origins
app.use(cors({
    origin: '*'
}));

// Test message
app.get('/api', async(req, res) => {
    res.status(200).send("Amica API v1.0.0");
});

// Listen on port
app.listen(port, () => console.log(`App listening on port ${port}`));