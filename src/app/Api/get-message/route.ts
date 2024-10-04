// import { User } from "next-auth";
// import { auth } from "../auth/[...nextauth]/options";
// import dbConnect from "@/lib/dbConnection";
// import mongoose from "mongoose";
// import userModel from "@/models/user";
// import questionModel from "@/models/question";

// export async function GET(request: Request) {
//   await dbConnect();

//   const session = await auth();
//   const user: User = session?.user as User;
//   if (!session || !session.user) {
//     return Response.json(
//       { success: false, message: "Not authenticated" },
//       { status: 401 }
//     );
//   }
//   const userId = new mongoose.Types.ObjectId(user._id);
//   console.log(userId);
//   try {
//     const question = await questionModel.aggregate([
//       { $match: { user: userId } },
//       // { $unwind: "$messages" },
//       // { $sort: { "messages.createdAt": -1 } },
//       // { $group: { _id: "$_id", messages: { $push: "$messages" } } },
//     ]);
//     console.log(user);
//     if (!user || user.length === 0) {
//       return Response.json(
//         { success: false, message: "User not found" },
//         { status: 200 }
//       );
//     }
//     return Response.json(
//       { success: true, messages: user[0].messages },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.log(error);
//   }
// }
import mongoose from "mongoose";
import { auth } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnection";
import questionModel from "@/models/question"; // Assuming the question model is exported from this path

export async function GET(request: Request) {
  // Connect to the database
  await dbConnect();

  // Get the authenticated session
  const session = await auth();
  const user = session?.user;

  if (!session || !user) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  // Get the user's ObjectId
  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    // Fetch all questions for the authenticated user, including messages
    const userQuestions = await questionModel
      .find({ user: userId })  // Query questions where the user field matches the authenticated user's ID
      .select("question messages createdAt")  // You can choose the fields you need, such as question, messages, and createdAt
      .exec();  // Execute the query

    // If no questions are found
    if (!userQuestions || userQuestions.length === 0) {
      return Response.json(
        { success: false, message: "No questions found for this user" },
        { status: 200 }
      );
    }

    console.log(userQuestions[0].messages);


    // Return the questions and their associated messages
    return Response.json(
      {
        success: true,
        questions: userQuestions,  // Send back the questions array
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      { success: false, message: "An error occurred" },
      { status: 500 }
    );
  }
}
