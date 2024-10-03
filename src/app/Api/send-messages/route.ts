import userModel from "@/models/user";
import dbConnect from "@/lib/dbConnection";
import { Message } from "@/models/user";
import { auth } from "../auth/[...nextauth]/options";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, content } = await request.json();
    const user = await userModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    console.log(user);
    //   user accepting the messages or not
    console.log("user accepting messages status: ", user.isAcceptingMessages)
    if (!user.isAcceptingMessages) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting messages currently",
        },
        { status: 403 }
      );
    }

    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    await user.save();

    console.log(user);
    return Response.json(
      {
        success: true,
        message: "Messsage sent successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Unexpected Error Occured: ", error);
    return Response.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
