import { User } from "next-auth";
import { auth } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnection";
import mongoose from "mongoose";
import userModel from "@/models/user";

export async function GET(request: Request) {
  await dbConnect();

  const session = await auth();
  const user: User = session?.user as User;
  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }
  const userId = new mongoose.Types.ObjectId(user._id);
  try {
    const user = await userModel.aggregate([
      { $match: { id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);
    if (!user || user.length === 0) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 200 }
      );
    }
    return Response.json(
      { success: true, messages: user[0].messages },
      { status: 401 }
    );
  } catch (error) {}
}
