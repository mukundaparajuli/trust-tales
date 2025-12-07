import mongoose from "mongoose";
import { auth } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnection";
import QuestionModel from "@/models/question";

export const dynamic = 'force-dynamic';

export async function GET(
    request: Request,
    { params }: { params: { questionId: string } }
) {
    try {
        await dbConnect();

        const session = await auth();
        const user = session?.user;

        if (!session || !user) {
            return new Response(
                JSON.stringify({ success: false, message: "Not authenticated" }),
                { status: 401, headers: { "Content-Type": "application/json" } }
            );
        }

        if (!user._id) {
            return new Response(
                JSON.stringify({ success: false, message: "User ID not found in session" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const { questionId } = params;

        if (!mongoose.Types.ObjectId.isValid(questionId)) {
            return new Response(
                JSON.stringify({ success: false, message: "Invalid question ID" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const userId = new mongoose.Types.ObjectId(user._id);

        // Fetch the specific question with all its messages
        const question = await QuestionModel
            .findOne({ _id: questionId, user: userId })
            .populate("messages")
            .exec();

        if (!question) {
            return new Response(
                JSON.stringify({ success: false, message: "Question not found or unauthorized" }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                question: question,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                success: false,
                message: "An error occurred while fetching question responses",
                error: error instanceof Error ? error.message : "Unknown error"
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
