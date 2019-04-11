const express = require('express');
const router = express.Router();
const mongoose =  require('mongoose');
const passport = require('passport');

const Profile = require('../../models/Profile');
const User = require('../../models/User')


//GET route: /api/profile/test
router.get('/test', (req,res) => res.json({msg:'Profile works'}));

//Current User Profile: private
router. get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    const errors = {};
    Profile.findOne({user: req.user.id})
        .then(profile => {
            if(!profile){
                errors.noprofile = 'There is no profile for this user'
                return res.status(404).json(errors)
            };
            res.json(profile)
        })
        .catch(err => res.status(404).json('Error in finding profile -->' + err))
})

module.exports = router;