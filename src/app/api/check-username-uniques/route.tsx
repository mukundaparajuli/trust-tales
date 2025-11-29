import dbConnect from "@/lib/dbConnection";
import userModel from "@/models/user";
import { z } from "zod";
import { usernameValidation } from "@/schema/signUpSchema";

export const dynamic = 'force-dynamic';

const usernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  try {
    await dbConnect();
  } catch (error) {
    console.error("Database connection error:", error);
    return Response.json(
      {
        success: false,
        message: "Database connection failed",
      },
      { status: 503 }
    );
  }

  //   localhost:3000/api/cuu?username=mukunda?email=abc@abc.com
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      username: searchParams.get("username"),
    };

    const result = usernameQuerySchema.safeParse(queryParams);
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors.length > 0
              ? usernameErrors.join(",")
              : "Invalid query parameters",
        },
        { status: 400 }
      );
    }
    const { username } = result.data;
    const existingVerifiedUser = await userModel.findOne({
      username,
      isVerified: true,
    });
    if (existingVerifiedUser) {
      return Response.json({
        success: false,
        message: "Username is already taken",
      });
    }
    return Response.json({
      success: true,
      message: "Username is available",
    });
  } catch (error) {
    console.error("Error checking username:", error);
    return Response.json(
      {
        success: false,
        message: "Error checking username",
      },
      { status: 500 }
    );
  }
}
