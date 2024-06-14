import { Message } from "@/models/user";

export interface ApiResponse {
  success: boolean;
  message: string;
  isAccepting?: boolean;
  messages?: Array<Message>;
}
