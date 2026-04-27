
// import mongoose from "mongoose";

// const connectDb = async () => {
//     if (!process.env.MONGO_URI) {
//         throw new Error("Missing MONGO_URI in environment variables");
//     }

//     if (mongoose.connection.readyState === 1) {
//         return mongoose.connection;
//     }

//     try {
//         const conn = await mongoose.connect(process.env.MONGO_URI);
//         console.log(`MongoDB Connected: ${conn.connection.host}`);
//         return conn;
//     } catch (error) {
//         console.error("MongoDB connection error:", error.message);
//         throw error;
//     }
// }

//   export default connectDb;


import mongoose from "mongoose";

let isConnected = false;

const connectDb = async () => {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false,
    });

    isConnected = db.connections[0].readyState;
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

export default connectDb;
