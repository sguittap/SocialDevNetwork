const express = require('express');
const mongoose = require('mongoose');
const users = require('./routes/api/users');
const posts = require('./routes/api/posts');
const profile = require('./routes/api/profile');
const auth = require('./routes/api/auth');
const path = require('path');   

require('dotenv').config();

const app = express();

//middleware
app.use(express.json({extended:false}))

//Connecting to DB
const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useCreateIndex:true, useFindAndModify: false});
        console.log('MongoDB connected');
    } catch(err) {
        console.log(`Error connecting --> ${err.message}`);
        process.exit(1);
    }
};
connectDB();

//Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);
app.use('/api/auth', auth);

//Serve static assests in production
if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'));
    app.get('*', (req,res) => {
        res.sendFile(path.resolve(__dirname,'client', 'build', 'index.html'));
    });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT);