import { resend } from "@/lib/resend";
import EmailVerification from "../../emails/verificationEmail";
import { ApiResponse } from "../../types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verificationCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Trust Tales Verification Code",
      react: EmailVerification({ username, otp: verificationCode }),
    });
    console.log("Email sent successfully");

    return { success: true, message: "Verification email sent successfully" };
  } catch (emailError) {
    console.error("Error sending verification email: ", emailError);
    return { success: false, message: "Failed to send verification email" };
  }
}
