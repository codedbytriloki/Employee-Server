import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

const MONGO_URL = process.env.Mongoose_Url;

if (!MONGO_URL) {
  console.error('Mongoose_Url is not set in environment variables');
}

// Use global cache to reuse mongoose connection across serverless invocations
// This prevents creating many connections and reduces function failures on Vercel
const globalAny = globalThis;
if (!globalAny._mongo) {
  globalAny._mongo = { conn: null, promise: null };
}

const connectToDatabase = async () => {
  if (globalAny._mongo.conn) {
    return globalAny._mongo.conn;
  }

  if (!globalAny._mongo.promise) {
    const opts = {
      serverSelectionTimeoutMS: 30000, // Increased from 5000 to 30000
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      retryWrites: true,
      w: 'majority'
    };
    globalAny._mongo.promise = mongoose.connect(MONGO_URL, opts).then((mongooseInstance) => {
      console.log('Successfully connected to MongoDB Atlas');
      return mongooseInstance;
    }).catch(err => {
      console.error('MongoDB Connection Error:', err.message);
      globalAny._mongo.promise = null;
      throw err;
    });
  }

  globalAny._mongo.conn = await globalAny._mongo.promise;
  console.log('Connected to Database');
  return globalAny._mongo.conn;
}

export default connectToDatabase;