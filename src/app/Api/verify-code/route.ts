import dbConnect from "@/lib/dbConnection";
import userModel from "@/models/user";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, code } = await request.json();

    const decodedUsername = decodeURIComponent(username);

    const user = await userModel.findOne({ username });
    if (!user) {
      return Response.json({
        success: false,
        message: "username verification failed",
      });
    }
    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      user.save();

      return Response.json({
        success: true,
        message: "code verified successfully",
      });


    } else if (isCodeNotExpired) {
      return Response.json({
        success: false,
        message: "invalid code",
      });
    } else {
      return Response.json({
        success: false,
        message: "code has already been expired",
      });
    }
  } catch (error) {
    return Response.json({
      success: false,
      message: "username verification failed",
    });
  }
}
