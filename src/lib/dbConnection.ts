import mongoose, { Mongoose } from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  // Check if we have a connection to the database or if it's currently connecting
  if (connection.isConnected) {
    console.log("Already connected to database");
    return;
  }

  // Check if mongoose has an active connection
  if (mongoose.connections[0].readyState) {
    connection.isConnected = mongoose.connections[0].readyState;
    console.log("Using existing database connection");
    return;
  }

  try {
    console.log("Connecting to database...");
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000,
    });

    connection.isConnected = db.connections[0].readyState;
    console.log("Database connected successfully");

    // Ensure all models are registered
    // This prevents "Schema hasn't been registered" errors
    if (!mongoose.models.Message) {
      await import("@/models/messages");
    }
    if (!mongoose.models.Question) {
      await import("@/models/question");
    }
    if (!mongoose.models.User) {
      await import("@/models/user");
    }
  } catch (error) {
    console.error("Database connection failed:", error);
    connection.isConnected = 0;
    throw new Error("Database connection failed");
  }
}

export default dbConnect;
