const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {check, validationResult} = require ('express-validator/check');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

//post a post..
router.post('/',[auth,[
    check('text', 'Text is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        };
    try {
        const user = await User.findById(req.user.id).select('-password');
        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        });
        const post = await newPost.save();
        res.json(post);
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error')
    };
});

//get all posts
router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({date: -1});
        res.json(posts)
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error')
    };
});

//get a post by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({msg:'Post not found'})
        }
        res.json(post)
    } catch (err) {
        console.log(err)
        if(error.kind === 'ObjectId'){
            return res.status(404).json({msg:'Post not found'})
        }
        res.status(500).send('Server Error')
    };
});

//delete a post
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({msg:'Post not found'})
        };
        if(post.user.toString() !== req.user.id){
            return res.status(401).json({msg:'User not authorized'})
        };
        await post.remove();
        res.json({msg:'Post deleted'})
    } catch (err) {
        console.log(err)
        if(error.kind === 'ObjectId'){
            return res.status(404).json({msg:'Post not found'})
        }
        res.status(500).send('Server Error')
    };
});

module.exports = router;