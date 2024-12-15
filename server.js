const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoute');
const emailRoutes = require('./routes/emailroute');
const cors = require("cors")
dotenv.config();

const app = express();
app.use(express.json());

// MongoDB connection
connectDB();
app.use(cors())

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/email', emailRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
