import { User } from "next-auth";
import { auth } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnection";
import mongoose from "mongoose";
import userModel from "@/models/user";

export const dynamic = 'force-dynamic';

export async function DELETE(
  request: Request,
  { params }: { params: { messageId: string } }
) {
  const messageId = params.messageId;
  await dbConnect();

  const session = await auth();
  const user: User = session?.user as User;
  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  try {
    const updatedResult = await userModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } }
    );
    if (updatedResult.modifiedCount == 0) {
      return Response.json(
        { success: false, message: "Message not found or already deleted" },
        { status: 404 }
      );
    }
    return Response.json(
      { success: true, message: "Message deleted successfully" },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      { success: false, message: "Error deleting message" },
      { status: 500 }
    );
  }
}
