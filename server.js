const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const proxyAuthRoutes = require('./routes/proxy-auth');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = ['http://localhost:3000', 'https://dmtart.pro', 'https://www.omexuae.com'];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // Allow requests without origin like Postman
    if(allowedOrigins.includes(origin)){
      callback(null, true); // Allow request
    } else {
      callback(new Error('Not allowed by CORS')); // Block any unallowed origin
    }
  },
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/proxy-auth', proxyAuthRoutes);

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Node.js Express Mongoose API' });
});

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nodejs-backend')
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.error('MongoDB connection error:', error);
});

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Node.js Express Mongoose API' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
