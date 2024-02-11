const router = require('express').Router();
const User = require('../models/User');

router.get("/friends/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        const friends = await Promise.all(user.followings.map((fri_id) => {
            return User.findById(fri_id);
        }));
        let friendList = [];
        friends.map((friend) => {
            const { _id, username, profilePicture } = friend;
            friendList.push({ _id, username, profilePicture })
        })
        res.status(200).json(friendList)
    } catch (error) {
        res.status(500).json(error)
    }
})


