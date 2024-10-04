import dbConnect from "@/lib/dbConnection";
import questionModel from "@/models/question";
import userModel from "@/models/user";

export async function POST(req: Request, res: Response) {

    await dbConnect();

    const { uuid } = await req.json();
    try {

        const question = await questionModel.findOne({ uuid });
        console.log("question info", question);

        const user = await userModel.findById(question?.user)
        console.log(user);
        return Response.json(
            {
                success: true,
                message: "Question sent successfully",
                question
            },
            { status: 201 }
        )
    } catch (error) {
        console.log("error occured while sending error");

        return Response.json(
            {
                success: false,
                message: "Question could not be sent",
            },
            {
                status: 200
            }
        )
    }

}