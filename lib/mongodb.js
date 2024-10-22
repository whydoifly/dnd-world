import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

const MONGODB_URI = process.env.MONGODB_URI;
console.log(
  'MongoDB URI:',
  MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//<hidden>:<hidden>@')
); // Safe logging of URI

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    console.log('Using cached MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log('Connecting to MongoDB...');
    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('Successfully connected to MongoDB');
        return mongoose;
      })
      .catch((error) => {
        console.error('Failed to connect to MongoDB:', error);
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
}

export default dbConnect;
