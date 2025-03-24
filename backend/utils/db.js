const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Ensure your environment variable contains the correct connection string
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully!!');
    } catch (error) {
        console.log(error.message);
        
    }
};

// Export the connectDB function
module.exports = connectDB;
