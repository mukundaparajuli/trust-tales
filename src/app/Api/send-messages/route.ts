import userModel from "@/models/user";
import dbConnect from "@/lib/dbConnection";
import questionModel, { Message } from "@/models/question";
import { upload } from '@/lib/multer';
import { uploadToCloudinary } from "../../../lib/cloudinary"


export async function POST(request: Request) {
  // Connect to the database
  await dbConnect();

  // Use multer to handle file uploads
  await upload.single('photo')

  console.log("multer middleware passed!");

  try {



    // const { userId, content, questionId, name } = await request.formData();
    const formData = await request.formData();
    console.log(formData);
    const userId = formData.get("userId");
    const content = formData.get("content");
    const name = formData.get("name");
    const questionId = formData.get("questionId");
    const photo = formData.get("photo");


    console.log(photo);
    if (!photo) {
      console.log("File not found");
    }

    let photoUrl = null;


    const user = await userModel.findById(userId);
    const question = await questionModel.findOne({ user: userId, _id: questionId });


    if (!user || !question) {
      return resolve(
        Response.json(
          { success: false, message: "User or question not found" },
          { status: 404 }
        )
      );
    }

    if (!user.isAcceptingMessages) {
      return resolve(
        Response.json(
          { success: false, message: "User is not accepting messages currently" },
          { status: 403 }
        )
      );
    }


    if (photo) {
      const cloudinaryResponse = await uploadToCloudinary(photo.path);
      if (cloudinaryResponse) {
        console.log(cloudinaryResponse);
        photoUrl = cloudinaryResponse.secure_url;
      } else {
        return resolve(
          Response.json(
            { success: false, message: "Failed to upload image to Cloudinary" },
            { status: 400 }
          )
        );
      }
    }


    const newMessage: Message = { content, name, photo: photoUrl, createdAt: new Date() };
    question.messages.push(newMessage);
    await question.save(); // Save the question with the new message

    return resolve(
      Response.json(
        { success: true, message: "Message sent successfully", photoUrl },
        { status: 201 }
      )
    );
  } catch (error) {
    console.error("Unexpected Error Occurred:", error);
    return reject(
      Response.json(
        { success: false, message: "Internal Server Error" },
        { status: 500 }
      )
    );
  }
}
