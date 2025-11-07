import mongoose from "mongoose";
import { auth } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnection";
// Import models to ensure they are registered
import MessageModel from "@/models/messages";
import QuestionModel from "@/models/question";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Connect to the database
    await dbConnect();

    // Get the authenticated session
    const session = await auth();
    const user = session?.user; if (!session || !user) {
      return new Response(
        JSON.stringify({ success: false, message: "Not authenticated" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate user ID exists
    if (!user._id) {
      return new Response(
        JSON.stringify({ success: false, message: "User ID not found in session" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Get the user's ObjectId
    const userId = new mongoose.Types.ObjectId(user._id);

    // Fetch all questions for the authenticated user, including messages
    const userQuestions = await QuestionModel
      .find({ user: userId })
      .populate("messages")
      .exec();

    // If no questions are found, return empty array (not an error)
    if (!userQuestions || userQuestions.length === 0) {
      return new Response(
        JSON.stringify({ success: true, questions: [], message: "No questions found yet" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Return the questions and their associated messages
    return new Response(
      JSON.stringify({
        success: true,
        questions: userQuestions,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "An error occurred while fetching messages",
        error: error instanceof Error ? error.message : "Unknown error"
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
