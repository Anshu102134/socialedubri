const FriendRequest = require('../models/friendRequest');

const sendRequestHandler = async (req, res) => {
  try {
    const { to } = req.body;           // receiver ID
    const from = req.user.id;         // sender ID from auth middleware

    if (to.toString() === from.toString()) {
      return res.status(400).json({ message: "You can't send a friend request to yourself." });
    }

    // 1. Check if they are already friends
    const User = require('../models/users');
    const sender = await User.findById(from);
    if (sender.friends.includes(to)) {
      return res.status(400).json({ message: 'You are already friends.' });
    }

    // 2. Check if a friend request already exists from ME to THEM
    const existingRequest = await FriendRequest.findOne({ from, to });
    if (existingRequest) {
      return res.status(400).json({ message: 'Friend request already sent.' });
    }

    // 3. Check if there is a pending request from THEM to ME
    const reciprocalRequest = await FriendRequest.findOne({ from: to, to: from, status: 'pending' });
    if (reciprocalRequest) {
      reciprocalRequest.status = 'accepted';
      await reciprocalRequest.save();

      const receiver = await User.findById(to);
      if (!sender.friends.includes(to)) sender.friends.push(to);
      if (!receiver.friends.includes(from)) receiver.friends.push(from);
      
      await sender.save();
      await receiver.save();

      return res.status(200).json({ message: 'You are now buds!', status: 'friends' });
    }

    const request = await FriendRequest.create({
      from,
      to,
    });

    res.status(201).json({
      message: 'Friend request sent successfully.',
      request
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = sendRequestHandler;
