const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {check, validationResult} = require ('express-validator/check');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');


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



// //GET route: /api/posts/test
// router.get('/test', (req,res) => res.json({msg:'Posts works'}));

// //Get all posts. route: api/posts
// router.get('/', (req,res) => {
//     Post.find()
//         .sort({date: -1})
//         .then(posts => res.json(posts))
//         .catch(err => res.status(404).json({notpostsfound: 'No posts found'}))
// });

// //Get a single post. route: api/posts/:id:
// router.get('/:id', (req,res) => {
//     Post.findById(req.params.id)
//         .then(post => res.json(post))
//         .catch(err => res.status(404).json({notpostfound: 'No post found with that ID'}))
// });

// //POST route: /api/posts
// router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
//     const {errors, isValid} = validatePostInput(req.body);
//     if(!isValid){
//         return res.status(400).json(errors)
//     }
//     const newPost = new Post({
//         text: req.body.text,
//         name: req.body.name,
//         avatar: req.body.avatar,
//         user: req.user.id
//     });
//     newPost.save().then(post => res.json(post))
// });

// //Delete route: api/post/:id 
// router.delete('/:id', passport.authenticate('jwt', {session: false}), (req,res) => {
//     Profile.findOne({user: req.user.id})
//         .then(profile => {
//             Post.findById(req.params.id)
//             .then(post => {
//                 if(post.user.toString() !== req.user.id){
//                     return res.status(401).json({notauthorized:'User not authorized'})
//                 }
//                 post.remove().then(() => res.json({success: true}))
//             })
//         })
//         .catch(err => res.status(404).json({postnotfound: 'No post found'}))
// });

// //Route for Likes api/posts/like/:id
// router.post('/like/:id', passport.authenticate('jwt', {session: false}), (req,res) => {
//     Profile.findOne({user: req.user.id})
//         .then(profile => {
//             Post.findById(req.params.id)
//             .then(post => {
//                 if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
//                     return res.status(400).json({alreadyliked: 'User already liked this post'})
//                 };
//                 post.likes.unshift({user: req.user.id})
//                 post.save().then(post => res.json(post))
//             })
//         })
//         .catch(err => res.status(404).json({postnotfound: 'No post found'}))
// });

// //Route for removing Likes api/posts/unlike/:id
// router.post('/unlike/:id', passport.authenticate('jwt', {session: false}), (req,res) => {
//     Profile.findOne({user: req.user.id})
//         .then(profile => {
//             Post.findById(req.params.id)
//             .then(post => {
//                 if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
//                     return res.status(400).json({notliked: 'You have not yet liked this post'})
//                 };
//                 const removeIndex = post.likes.map(item => item.user.toString()).indexOf(req.user.id);
//                 post.likes.splice(removeIndex, 1);
//                 post.save().then(post => res.json(post));

//             })
//         })
//         .catch(err => res.status(404).json({postnotfound: 'No post found'}))
// });

// //Add Comment api/posts/comment/:id
// router.post('/comment/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
//     const {errors, isValid} = validatePostInput(req.body);
//     if(!isValid){
//         return res.status(400).json(errors)
//     }
//     Post.findById(req.params.id)
//         .then(post => {
//             const newComment = {
//                 text: req.body.text,
//                 name: req.body.name,
//                 avatar: req.body.avatar,
//                 user: req.user.id
//             };
//             post.comments.unshift(newComment);
//             post.save().then(post => res.json(post));
//         })
//         .catch(err => res.status(404).json({postnotfound: 'No post found'}))
// });

// //Delete Comment api/posts/comment/:id/:comment_id
// router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', {session: false}), (req, res) => {
//     Post.findById(req.params.id)
//         .then(post => {
//             if(post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0 ){
//                 return res.status(404).json({commentnotexists: 'Comment does not exist'})
//             };
//             const removeIndex = post.comments.map(item => item._id.toString()).indexOf(req.params.comment_id);
//             post.comments.splice(removeIndex, 1);
//             post.save().then(post => res.json(post))

//         })
//         .catch(err => res.status(404).json({postnotfound: 'No post found'}))
// });

module.exports = router;