const express = require('express');
const mongoose = require('mongoose');
const users = require('./routes/api/users');
const posts = require('./routes/api/posts');
const profile = require('./routes/api/profile');


require('dotenv').config();

const app = express();

//DB config
const db = require('./config/keys').mongoURI;
//Connecting to DB
mongoose.connect(db, {useNewUrlParser: true})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(`Error connecting --> ${err}`));

app.get('/', (req, res) => res.send('hello, this is working'));
//Routes
app.use('/api/users', users)
app.use('/api/profile', profile)
app.use('/api/posts', posts)

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on port ${port}`))