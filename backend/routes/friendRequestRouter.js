const express = require('express');
const router = express.Router();
const sendRequestHandler=require('../controllers/friendRequestSend')
const acceptRequestHandler=require('../controllers/friendRequestReceive')
const cacelRequestHandler=require('../controllers/friendRequestCancel')
const getPendingRequests=require('../controllers/friendRequestInbox')
const authMiddleware = require('../middleware/authMiddleware');
router.post('/send', authMiddleware, sendRequestHandler)
router.post('/accept', authMiddleware, acceptRequestHandler)
router.post('/cancel', authMiddleware, cacelRequestHandler)
router.get('/inbox', authMiddleware, getPendingRequests);
module.exports=router