const express = require('express');
const router = express.Router();
const request = require('request');
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

//Add profile experience
router.put('/experience', [auth,[
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty(),
]], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    const {title, company, location, from, to, current, description} = req.body;
    const newExp = {title, company, location, from, to, current, description};
    try {
        const profile = await Profile.findOne({user: req.user.id});
        if(!profile){
            return res.json({msg:'You have no profile'})
        };
        profile.experience.unshift(newExp);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error')
    }
});

//Delete experience
router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.user.id});
        const removeIndex = profile.experience.map(item => item.id.indexOf(req.params.exp_id));
        profile.experience.splice(removeIndex, 1);
        await profile.save();
        res.json(profile)
    } catch (err) {
        res.status(500).send('Server Error')
    };
});

//Add profile education
router.put('/education', [auth,[
    check('school', 'School is required').not().isEmpty(),
    check('degree', 'Degree is required').not().isEmpty(),
    check('fieldofstudy', 'Field of Study date is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty(),
]], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    const {school, degree, fieldofstudy, from, to, current, description} = req.body;
    const newEdu = {school, degree, fieldofstudy, from, to, current, description};
    try {
        const profile = await Profile.findOne({user: req.user.id});
        if(!profile){
            return res.json({msg:'You have no profile'})
        };
        profile.education.unshift(newEdu);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error')
    }
});

//Delete education
router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.user.id});
        const removeIndex = profile.education.map(item => item.id.indexOf(req.params.edu_id));
        profile.education.splice(removeIndex, 1);
        await profile.save();
        res.json(profile)
    } catch (err) {
        res.status(500).send('Server Error')
    };
});

//Get GitHub api/profile/github/username
router.get('/github/:username',(req, res) => {
    try {
        const options = {
            uri:`https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_SECRET}`,
                method:'GET',
                headers:{'user-agent':'node.js'}
        };
        request(options, (error, response, body) => {
            if(error) console.log(error);
            if(response.statusCode !== 200){
                console.log(response)
                return res.status(404).json({msg:'No Github Profile found'})
            };
            res.json(JSON.parse(body));
        })
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error')
    }
});


module.exports = router;