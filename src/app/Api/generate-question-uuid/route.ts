// /pages/api/post-question.ts

import { v4 as uuidv4 } from "uuid";
import QuestionModel, { Question } from "@/models/question";
import { auth } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnection";

export async function POST(req: Request, res: Response) {

    await dbConnect();  // Add database connection

    const session = await auth();
    const user = session?.user;
    if (!session || !session.user || !user?._id) {
        return Response.json(
            { success: false, message: "Not authenticated" },
            { status: 401 }
        );
    }

    const { question } = await req.json();

    if (!question) {
        return Response.json(
            {
                success: false,
                message: "Question is a required field",
            },
            { status: 400 }
        );
    }

    try {
        // Generate a UUID for the question
        const questionUUID = uuidv4();


        // Create a new question document
        const newQuestion: Question = new QuestionModel({
            question: question,
            uuid: questionUUID,
            user: user._id,  // Use user._id instead of entire user object
        });


        // Save the question to the database
        await newQuestion.save();


        return Response.json(
            {
                success: true,
                message: "Question posted successfully",
                question: newQuestion,
            },
            { status: 201 }
        );

    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "Internal Server Error",
            },
            { status: 500 }
        );
    }
};

