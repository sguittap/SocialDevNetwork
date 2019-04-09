const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

//DB config
const db = require('./config/keys').mongoURI;
//Connecting to DB
mongoose.connect(db)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(`Error connecting --> ${err}`));

app.get('/', (req, res) => res.send('hello, this is working'));

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on port ${port}`))