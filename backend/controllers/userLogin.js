const users = require('../models/users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // ✅ changed from 'bcrypt'

const LoginUser = async (req, res) => {
    const { email, password } = req.body;
    console.log('outer login');

    try {
        const user = await users.findOne({ email: email });
        if (!user) {
            console.log('inner user verification login');
            return res.status(404).json({ message: 'User not found' });
        }

        // ✅ Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('❌ Invalid credentials');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const payload = { id: user._id };
        const secretKey = process.env.JWT_SECRET || 'supersecret123';
        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

        res.json({ token, user: { _id: user._id, name: user.name, email: user.email, profileImage: user.profileImage, bio: user.bio } });
    } catch (error) {
        console.log('Login failed', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = LoginUser;