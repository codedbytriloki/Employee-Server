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
      // Mongoose 6+ has sensible defaults; include a short server selection timeout
      serverSelectionTimeoutMS: 5000
    };
    globalAny._mongo.promise = mongoose.connect(MONGO_URL, opts).then((mongooseInstance) => {
      return mongooseInstance;
    }).catch(err => {
      globalAny._mongo.promise = null;
      throw err;
    });
  }

  globalAny._mongo.conn = await globalAny._mongo.promise;
  console.log('Connected to Database');
  return globalAny._mongo.conn;
}

export default connectToDatabase;