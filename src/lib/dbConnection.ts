import mongoose, { Mongoose } from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to the database");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
    // console.log(db);
    // console.log(db.connections);
    console.log(db.connections[0].readyState);
    connection.isConnected = db.connections[0].readyState;
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Could not connect to the database: ", error);
    process.exit(1);
  }
}

export default dbConnect;
