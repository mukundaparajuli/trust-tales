// /pages/api/post-question.ts

import { v4 as uuidv4 } from "uuid";
import questionModel, { Question } from "@/models/question";
import { auth } from "../auth/[...nextauth]/options";
import { User } from "@/models/user";

export async function POST(req: Request, res: Response) {


    const session = await auth();
    const user: User = session?.user as User;
    if (!session || !session.user) {
        return Response.json(
            { success: false, message: "Not authenticated" },
            { status: 401 }
        );
    }

    console.log(user);
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

        console.log("question uuid: ", questionUUID);

        // Create a new question document
        const newQuestion: Question = new questionModel({
            question: question,
            uuid: questionUUID,
            user: session.user._id,
        });

        console.log("new question is: ", newQuestion);

        // Save the question to the database
        await newQuestion.save();

        console.log("new question has been saved!");

        return Response.json(
            {
                success: true,
                message: "Question posted successfully",
                question: newQuestion,
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Error saving question:", error);
        return Response.json(
            {
                success: false,
                message: "Internal Server Error",
            },
            { status: 500 }
        );
    }
};

