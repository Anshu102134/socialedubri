require('dotenv').config(); // load environment variables

const express = require('express');
const app = express();
const http = require('http');

const connectDB = require('./config/db');

const userRoutes = require('./routes/userRouter');
const friendRequestRoutes = require('./routes/friendRequestRouter');
const postRoutes = require('./routes/postRouter');

const authdMiddleware = require('./middleware/authMiddleware');

const cors = require("cors");

const { initSocket } = require('./sockets/index');

const server = http.createServer(app);

// Connect to MongoDB first
connectDB()
    .then(() => {

        // Middleware
        app.use(cors());
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        // Static files
        app.use('/uploads', express.static('uploads'));

        // Auth middleware
       // app.use(authdMiddleware);

        // Routes
        app.use('/api/users', userRoutes);
        app.use('/api/friendRequest', friendRequestRoutes);
        app.use('/api/posts', postRoutes);

        // Initialize sockets
        initSocket(server);

        // IMPORTANT: dynamic port for deployment
        const PORT = process.env.PORT || 5000;

        server.listen(PORT, () =>
            console.log(`Server running on port ${PORT}`)
        );

    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err.message);
    });