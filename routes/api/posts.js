const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {check, validationResult} = require ('express-validator/check');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

//add a post
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

//Adding a like to a post
router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
            return res.status(400).json({msg:'Post already liked'})
        };
        post.likes.unshift({user: req.user.id});
        await post.save();
        res.json(post.likes);
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error')
    };
});

//Unliking a post
router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
            return res.status(400).json({msg:'Post has not been liked'})
        };
        const removeIndex  = post.likes.map(like => like.user.toString()).indexOf(req.user.id);
        post.likes.splice(removeIndex, 1);
        await post.save();
        res.json(post.likes);
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error')
    };
});

//add a comment
router.post('/comment/:id',[auth,[
    check('text', 'Text is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        };
    try {
        const user = await User.findById(req.user.id).select('-password');
        const post = await Post.findById(req.params.id);
        const newComment = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        };
        post.comments.unshift(newComment)
        await post.save();
        res.json(post.comments);
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error')
    };
});

//delete a comment
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);
        if(!comment){
            return res.status(404).json({msg:'Comment does not exist'});
        };
        if(comment.user.toString() !== req.user.id){
            return res.status(401).json({msg: 'User not authorized'});
        };
        const removeIndex  = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id);
        post.comments.splice(removeIndex, 1);
        await post.save();
        res.json(post.comments);
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error')
    };
});

module.exports = router;