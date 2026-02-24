import mongoose from 'mongoose';

export async function connectDB() {
    const MONGO_URI = process.env.MONGO_URI || process.env.DATABASE_URL;

    if (!MONGO_URI) {
        throw new Error(
            "MONGO_URI or DATABASE_URL must be set. Did you forget to add it to your .env file?",
        );
    }

    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB Atlas");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        throw err;
    }
}

export const db = mongoose.connection;
