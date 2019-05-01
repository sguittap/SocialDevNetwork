const express = require('express');
const mongoose = require('mongoose');
const users = require('./routes/api/users');
const posts = require('./routes/api/posts');
const profile = require('./routes/api/profile');
const auth = require('./routes/api/auth');
const passport = require('passport');

require('dotenv').config();

const app = express();

//middleware
app.use(express.json({extended:false}))

//DB config
const db = require('./config/keys').mongoURI;

//Connecting to DB
const connectDB = async () => {
    try{
        await mongoose.connect(db, {useNewUrlParser: true, useCreateIndex:true});
        console.log('MongoDB connected');
    } catch(err) {
        console.log(`Error connecting --> ${err.message}`);
        process.exit(1);
    }
};
connectDB();

//Passport middleware
app.use(passport.initialize());
require('./config/passport')(passport);

//Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);
app.use('/api/auth', auth);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`))