const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const users = require('./routes/api/users');
const posts = require('./routes/api/posts');
const profile = require('./routes/api/profile');
const passport = require('passport');

require('dotenv').config();

const app = express();

//middleware
// app.use(bodyParser.urlencoded({extended:false}));
// app.use(bodyParser.json());
app.use(express.json({extended:false}))

//DB config
const db = require('./config/keys').mongoURI;
//Connecting to DB
const connectDB = async() => {
    try{
        await mongoose.connect(db, {useNewUrlParser: true, useCreateIndex:true});
        console.log('MongoDB connected');
    } catch(err) {
        console.log(`Error connecting --> ${err.message}`);
        process.exit(1);
    }
};
// mongoose.connect(db, {useNewUrlParser: true})
//     .then(() => console.log('MongoDB connected'))
//     .catch(err => console.log(`Error connecting --> ${err}`));

//Passport middleware
app.use(passport.initialize());
require('./config/passport')(passport);

//Routes
app.use('/api/users', users)
app.use('/api/profile', profile)
app.use('/api/posts', posts)

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`))