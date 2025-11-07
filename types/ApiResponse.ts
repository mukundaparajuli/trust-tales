import { Message } from "@/models/messages";
import { Question } from "@/models/question";

export interface ApiResponse {
  success: boolean;
  message: string;
  isAccepting?: boolean;
  messages?: Array<Message>;
  questions?: Array<Question>;
  question?: Question;
}
