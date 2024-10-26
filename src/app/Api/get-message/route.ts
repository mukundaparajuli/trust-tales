import mongoose from "mongoose";
import { auth } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnection";
import questionModel from "@/models/question";

export async function GET(request: Request) {
  // Connect to the database
  await dbConnect();

  // Get the authenticated session
  const session = await auth();
  const user = session?.user;

  if (!session || !user) {
    return new Response(
      JSON.stringify({ success: false, message: "Not authenticated" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  // Get the user's ObjectId
  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    // Fetch all questions for the authenticated user, including messages
    const userQuestions = await questionModel
      .find({ user: userId })
      .populate("messages")
      .exec();

    console.log(userQuestions[2].messages);

    // If no questions are found
    if (!userQuestions || userQuestions.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "No questions found for this user" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Return the questions and their associated messages
    return new Response(
      JSON.stringify({
        success: true,
        questions: userQuestions,  // Send back the questions array
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ success: false, message: "An error occurred" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
