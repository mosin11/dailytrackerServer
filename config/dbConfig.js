const mongoose = require('mongoose');

const connectDB = async () => {
    try {

       // console.log('MONGODB_URI:', process.env.MONGODB_URI);
        const uri = process.env.MONGODB_URI; // Ensure this is correctly retrieved
        if (!uri) {
            throw new Error('MONGO_URI is not defined');
        }
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully.');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
