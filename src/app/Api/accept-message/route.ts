import dbConnect from "@/lib/dbConnection";
import userModel from "@/models/user";
import getServerSession from "next-auth";
import authOptions from "@/lib/authOptions"; // assuming authOptions is exported from this file
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Not an authenticated user",
      }),
      { status: 401 }
    );
  }

  const user = session.user as User & { _id: string }; // assuming User has _id
  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      user._id,
      { isAcceptingMessages: acceptMessages },
      { new: true }
    );

    if (!updatedUser) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User not updated",
        }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Message acceptance status updated successfully",
        updatedUser,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update user to accept messages: ", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to update user status to accept messages",
      }),
      { status: 500 }
    );
  }
}
