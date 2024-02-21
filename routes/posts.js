const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');

// Create new Post
router.post('/', async (req, res) => {
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).json({
            "message": "Post created successfully !!",
            "data": savedPost
        })

    } catch (error) {
        res.status(500).json(error);
    }
})

// Update Post
router.put('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body }, {new: true});
            res.status(200).json({
                "message": "Post created successfully !!",
                "data": post
            });
            
        } else {
            res.status(403).json("You can only update your post !")
        }
        

    } catch (error) {
        res.status(500).json(error);
    }
})

// Delete Post
router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.deleteOne({ $set: req.body }, {new: true});
            res.status(200).json("Your Post has been deleted !!");
            
        } else {
            res.status(403).json("You can only delete your post !")
        }
        

    } catch (error) {
        res.status(500).json(error);
    }
})

// get All Posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);

    } catch (error) {
        res.status(500).json(error);
    }
})

// get like/dislike
router.get('/:id/like', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: {likes: req.body.userId} })
            res.status(200).json("The post has been liked !");
        } else {
            await post.updateOne({ $pull: {likes: req.body.userId} })
            res.status(200).json("The post has been disliked !");
        }

    } catch (error) {
        res.status(500).json(error);
    }
})

// get a post by id
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);

    } catch (error) {
        res.status(500).json(error);
    }
})

// 
router.get('/timeline/:userId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId);
        const userPosts = await Post.find({ userId: currentUser._id });
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({ userId: friendId })
            })
        ); 
        
        res.status(200).json(userPosts.concat(...friendPosts));
        
    } catch (error) {
        res.status(500).json(error);
    }
})

// 
router.get('/profile/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username })
        //console.log(user)
        const post = await Post.find({ userId: user._id });
        res.status(200).json(post);

    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router







