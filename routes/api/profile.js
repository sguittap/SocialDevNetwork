const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const {check, validationResult} = require ('express-validator/check');

//Current user Profile
router. get('/me', auth, async (req, res) => {
    try{
        const profile = await Profile.findOne({user: req.user.id}).populate('users', ['name', 'avatar']);
        if(!profile){
            return res.status(400).json({msg:'There is no Profile for this user'})
        };
        res.json(profile);
    } catch(err) {
        res.status(500).send('Server Error')
    }
});

//Create or update User profile
router.post('/',[auth, [
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    };
    const {company, website, location, bio, status, githubusername, skills, youtube, facebook, twitter, instagram, linkedin} = req.body;
    const profileFields = {};
    profileFields.user = req.user.id;
    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(bio) profileFields.bio = bio;
    if(status) profileFields.status = status;
    if(githubusername) profileFields.githubusername = githubusername;
    if(skills) {profileFields.skills = skills.split(',').map(skill => skill.trim())};
    profileFields.social = {};
    if(youtube) profileFields.social.youtube = youtube;
    if(facebook) profileFields.social.facebook = facebook;
    if(twitter) profileFields.social.twitter = twitter;
    if(instagram) profileFields.social.instagram = instagram;
    if(linkedin) profileFields.social.linkedin = linkedin;
    try{
        let profile = await Profile.findOne({user: req.user.id})
        if(profile){
            profile = await Profile.findOneAndUpdate({user: req.user.id}, {$set: profileFields}, {new:true});
            return res.json(profile);
        };
        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);
    } catch(err){
        res.status(500).send('Server Error')
    }
});

//Get all profiles
router.get('/', async (req, res) => {
    try {
        const profiles =  await Profile.find().populate('users', ['name', 'avatar']);
        res.json(profiles);
    } catch (err) {
        res.status(500).send('Server Error')
    };
});

//Get profile by id
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.params.user_id}).populate('users', ['name', 'avatar']);
        if(!profile) return res.status(400).json({msg:'Profile not found'})
        res.json(profile);
    } catch (err) {
        if(err.kind === 'ObjectId') return res.status(400).json({msg:'Profile not found'})
        res.status(500).send('Server Error')
    };
});

//Delete profile, user, and posts
router.delete('/', auth, async (req, res) => {
    try {
        await Profile.findOneAndRemove({user: req.user.id});
        await User.findOneAndRemove({_id: req.user.id});
        res.json({msg:'User Deleted'});
    } catch (err) {
        res.status(500).send('Server Error')
    };
});


module.exports = router;