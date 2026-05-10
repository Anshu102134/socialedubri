const User = require('../models/users');
const bcrypt = require('bcryptjs'); // ✅ use bcryptjs

const registerUser = async (req, res) => {
    try {
        console.log(req.body);
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Safely get uploaded file name if exists
        const profileImageFilename = req.file ? req.file.filename : '';
        const profileImage = profileImageFilename
            ? `/uploads/${profileImageFilename}`
            : '';

        const newUser = new User({
            name,
            email,
            password: hashedPassword, // ✅ store hashed password
            profileImage,
        });

        await newUser.save();

        res.status(201).json({
            message: 'User registered!',
            user: newUser,
        });

    } catch (err) {
        console.error('Registration failed:', err);
        res.status(500).json({ message: err.message });
    }
};

module.exports = registerUser;