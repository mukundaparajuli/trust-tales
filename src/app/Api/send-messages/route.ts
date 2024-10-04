import userModel from "@/models/user";
import dbConnect from "@/lib/dbConnection";
import questionModel, { Message } from "@/models/question";

export async function POST(request: Request) {
  await dbConnect();
  try {


    const { userId, content, questionId } = await request.json();
    console.log(userId);
    console.log("user vettiyo");
    const user = await userModel.findById(userId);
    const question = await questionModel.findOne({ user: userId, _id: questionId });
    if (!user || !question) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

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
    console.log(newMessage);
    question.messages.push(newMessage as Message);
    await question.save();

    console.log(question);
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
