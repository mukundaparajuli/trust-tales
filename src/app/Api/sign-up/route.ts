import dbConnect from "@/lib/dbConnection";
import userModel from "@/models/user";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();
    const existingUserWithVerifiedUsername = await userModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUserWithVerifiedUsername) {
      return Response.json(
        {
          success: false,
          message: "User already exists!",
        },
        { status: 400 }
      );
    }

    const existingUserWithEmail = await userModel.findOne({ email });
    const verifyCode = Math.floor(10000 + Math.random() * 9000).toString();
    if (existingUserWithEmail) {
      if (existingUserWithEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exists!",
          },
          { status: 500 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserWithEmail.password = hashedPassword;
        existingUserWithEmail.verifyCode = verifyCode;
        existingUserWithEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserWithEmail.save();
      }
    } else {
      const hashedPassword = bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      const newUser = new userModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMesssages: true,
        messages: [],
      });

      await newUser.save();

      // send verification email
      const emailResponse = await sendVerificationEmail(
        username,
        email,
        verifyCode
      );

      if (!emailResponse) {
        return Response.json(
          {
            success: false,
            message: "User already exists!",
          },
          { status: 500 }
        );
      }
      return Response.json(
        {
          success: true,
          message: "User registered successfully!",
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.log("Error while signing up user: ", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      { status: 500 }
    );
  }
}
