import mongoose, { Mongoose } from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
    connection.isConnected = db.connections[0].readyState;

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
    process.exit(1);
  }
}

export default dbConnect;
