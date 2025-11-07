import userModel from "@/models/user";
import dbConnect from "@/lib/dbConnection";
import QuestionModel from "@/models/question";
import { uploadToCloudinary } from "@/lib/cloudinary"
import { writeFile } from "fs";
import { join } from "path";
import MessageModel from "@/models/messages";
import mongoose from "mongoose";


export async function POST(request: Request) {
  await dbConnect();


  try {
    const formData = await request.formData();
    const userId = formData.get("userId");
    const message = formData.get("message");
    const name = formData.get("name");
    const project = formData.get("project");
    const questionId = formData.get("questionId");
    const photo: File | null = formData.get("photo") as unknown as File;
    const rating = formData.get("rating");


    if (!userId || !message || !questionId) {
      return Response.json(
        { success: false, message: "Missing required fields: userId, message, or questionId" },
        { status: 400 }
      );
    }

    if (!photo) {
    }

    let photoUrl = null;

    const user = await userModel.findById(userId);
    const question = await QuestionModel.findOne({ user: userId, _id: questionId });


    if (!user || !question) {
      return Response.json(
        { success: false, message: "User or question not found" },
        { status: 404 }
      );
    }

    if (!user.isAcceptingMessages) {
      return Response.json(
        { success: false, message: "User is not accepting messages currently" },
        { status: 403 }
      );
    }


    if (photo) {
      const bytes = await photo?.arrayBuffer();
      const buffer = Buffer.from(bytes);


      const destinationPath = join(__dirname, '..', 'uploads');
      writeFile(destinationPath, buffer, err => {
        if (err) {
        } else {
        }
      }
      );




      const cloudinaryResponse = await uploadToCloudinary(destinationPath);
      if (cloudinaryResponse) {
        photoUrl = cloudinaryResponse.secure_url;
      } else {
        return Response.json(
          { success: false, message: "Failed to upload image to Cloudinary" },
          { status: 400 }
        );
      }
    }

    const newMessage = await MessageModel.create({
      message,
      name: name || "",
      project: project || "",
      photo: photoUrl || "",
      rating: rating ? Number(rating) : 0,
      createdAt: new Date()
    });

    question.messages.push(newMessage._id as any);
    await question.save();

    return Response.json(
      { success: true, message: "Message sent successfully", photoUrl },
      { status: 201 }
    );

  } catch (error) {
    return Response.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
