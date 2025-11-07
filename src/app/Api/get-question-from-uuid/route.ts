import dbConnect from "@/lib/dbConnection";
import QuestionModel from "@/models/question";
import userModel from "@/models/user";

export async function POST(req: Request, res: Response) {

    await dbConnect();

    const { uuid } = await req.json();
    try {

        const question = await QuestionModel.findOne({ uuid });

        if (!question) {
            return Response.json(
                {
                    success: false,
                    message: "Question not found. This link may be invalid.",
                },
                { status: 404 }
            );
        }

        const user = await userModel.findById(question?.user)
        return Response.json(
            {
                success: true,
                message: "Question sent successfully",
                question
            },
            { status: 201 }
        )
    } catch (error) {

        return Response.json(
            {
                success: false,
                message: "Question could not be fetched",
                error: error instanceof Error ? error.message : "Unknown error"
            },
            {
                status: 500
            }
        )
    }

}