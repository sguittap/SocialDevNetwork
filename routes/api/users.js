const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



//GET route: /api/users/test
router.get('/test', (req,res) => res.json({msg:'Users works'}));

//Register newUser
router.post('/register', (req, res) => {
    User.findOne({email:req.body.email})
        .then(user => {
            if(user){
                return res.status(400).json({email:'Email already exists'})
            } else{
                const avatar = gravatar.url(req.body.email,{
                    s:'200', r:'pg', d:'mm'
                });
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    avatar
                })
                bcrypt.genSalt(10, (err, salt) =>{
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    })
                })
            }
        })
});

//Login User
router.post('/login', (req, res) => {
    const email = req.body.email;    
    const password = req.body.password;    
    User.findOne({email})
        .then(user => {
            if(!user){
                return res.status(404).json({email:'User not found'})
            }
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(isMatch){
                        const payload = {id: user.id, name: user.name, avatar: user.avatar}
                        jwt.sign(payload, process.env.JWT_KEY, {expiresIn: 3600}, (err, token) => {
                            res.json({success: true, token: 'Bearer ' + token});
                        });
                    } else {
                        return res.status(400).json({password:'Password incorrect'})
                    }
                })
        })
});

module.exports = router;