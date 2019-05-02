const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {check, validationResult} = require ('express-validator/check');

//register newUser
router.post('/', [
    check('name','Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({min:6})
], async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    };
    const {name, email, password} = req.body;
    try{
        let user = await User.findOne({email: email});
        if(user){
            return res.status(400).json({errors:[{msg:'User already exists'}]})
        };
        const avatar = gravatar.url(req.body.email,{
            s:'200', r:'pg', d:'mm'
        });
        user = new User({name, email, password, avatar});
        let salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        const payload = {
            user:{id:user.id}
        };
        jwt.sign(payload, process.env.JWT_KEY, {expiresIn: 3600},(err, token) => {
            if(err) throw err;
            res.json({token});
        });
    } catch(err){
        res.status(500).send('Server Error')
    };
});

module.exports = router;