import userModel from "@/models/user";
import dbConnect from "@/lib/dbConnection";
import questionModel, { Message } from "@/models/question";
import { uploadToCloudinary } from "@/lib/cloudinary"
import { writeFile } from "fs";
import { join } from "path";
import messageModel from "@/models/messages";


export async function POST(request: Request) {
  await dbConnect();


  try {
    const formData = await request.formData();
    console.log(formData);
    const userId = formData.get("userId");
    const content = formData.get("content");
    const name = formData.get("name");
    const questionId = formData.get("questionId");
    const photo: File | null = formData.get("photo") as unknown as File;

    console.log(photo);
    if (!photo) {
      console.log("File not found");
    }

    let photoUrl = null;

    const user = await userModel.findById(userId);
    const question = await questionModel.findOne({ user: userId, _id: questionId });


    if (!user || !question) {
      return Response.json(
        { success: false, message: "User or question not found" },
        { status: 404 }
      )

    }

    if (!user.isAcceptingMessages) {
      return Response.json(
        { success: false, message: "User is not accepting messages currently" },
        { status: 403 }
      )

    }


    if (photo) {
      const bytes = await photo?.arrayBuffer();
      const buffer = Buffer.from(bytes);


      const destinationPath = join(__dirname, '..', 'uploads');
      writeFile(destinationPath, buffer, err => {
        if (err) {
          console.error(err);
        } else {
          console.log("File has been uploaded successfully")
        }
      }
      );
      console.log(`open ${destinationPath} to see the uploaded file`)




      const cloudinaryResponse = await uploadToCloudinary(destinationPath);
      if (cloudinaryResponse) {
        console.log(cloudinaryResponse);
        photoUrl = cloudinaryResponse.secure_url;
      } else {
        return Response.json(
          { success: false, message: "Failed to upload image to Cloudinary" },
          { status: 400 }
        )

      }
    }


    // Create a new message document in the database
    const newMessage = await messageModel.create({
      content,
      name,
      photo: photoUrl,
      createdAt: new Date()
    });

    // Embed the message data into the question's messages array
    const messageToEmbed = {
      _id: newMessage._id,   // Embed the same _id
      content: newMessage.content,
      name: newMessage.name,
      photo: newMessage.photo,
      createdAt: newMessage.createdAt
    };

    // Add the new message object to the question's messages array
    question.messages.push(messageToEmbed);
    await question.save();

    return Response.json(
      { success: true, message: "Message sent successfully", photoUrl },
      { status: 201 }
    )

  } catch (error) {
    console.error("Unexpected Error Occurred:", error);
    return Response.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    )

  }
}
