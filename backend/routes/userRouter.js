// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const registerUser = require('../controllers/userRegistration');
const upload = require('../middleware/uploadMiddleware');
const loginUser=require('../controllers/userLogin') 
const searchFriend=require('../controllers/searchFriend')
const updateProfile = require('../controllers/updateProfile');
const getMe = require('../controllers/getMe');
const getUserProfile = require('../controllers/getUserProfile');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', upload.single('profileImage'), registerUser);
router.post('/login',loginUser)
router.get('/search', authMiddleware, searchFriend)
router.get('/me', authMiddleware, getMe);
router.get('/profile/:id', authMiddleware, getUserProfile);
router.put('/update-profile', authMiddleware, upload.single('profileImage'), updateProfile);
const unfriend = require('../controllers/unfriend');
router.post('/unfriend', authMiddleware, unfriend);
module.exports = router;

