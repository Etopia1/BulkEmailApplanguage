const mongoose = require('mongoose');

const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log('MongoDB connected successfully');
    })
    .catch((err) => {
      console.error(`MongoDB connection error: ${err.message}`);
      process.exit(1); // Exit the application if the connection fails
    });
};

module.exports = connectDB;
