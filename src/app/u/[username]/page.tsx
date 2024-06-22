"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { messageSchema } from "@/schema/messageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ApiResponse } from "../../../../types/ApiResponse";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const MessageComponent = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const { toast } = useToast();
  const params = useParams();
  const { username } = params;

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });
  const checkIfUserAcceptingMessages = async () => {
    try {
      const response = await axios.get(`/api/accept-message`);
      console.log("IS user accepting messages:", response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const generateMessages = async () => {
    setIsLoadingSuggestions(true);
    setSuggestedMessages([]); // Clear the current suggested messages
    try {
      const response = await axios.get("/api/suggest-messages/");
      setSuggestedMessages(response.data.messageSuggestion);
    } catch (error) {
      console.error("Error fetching suggested messages:", error);
      toast({
        title: "Error",
        description: "Failed to fetch suggested messages.",
      });
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsSubmitting(true);

    await checkIfUserAcceptingMessages();
    try {
      const response = await axios.post<ApiResponse>(`/api/send-messages/`, {
        username: username,
        content: data.content,
      });
      toast({
        title: "Success",
        description: response.data.message,
      });
      form.reset();
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message || "Error while sending the data",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler to set the clicked suggested message into the textarea
  const handleSuggestedMessageClick = (message: string) => {
    form.setValue("content", message);
  };

  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="font-bold text-4xl mb-10 text-center">
        Public Profile Link
      </h1>
      <div className="my-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6 w-full"
          >
            <FormField
              name="content"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="content">
                    Send anonymous message to @{username}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Type your message here."
                      className="resize-none border-black border-2 w-full"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div>
              {isSubmitting ? (
                <Button disabled>
                  <Loader2 className="animate-spin" />
                </Button>
              ) : (
                <Button type="submit">Send message</Button>
              )}
            </div>
          </form>
        </Form>
      </div>
      <Separator />
      <div className="mt-6">
        <Button onClick={generateMessages} disabled={isLoadingSuggestions}>
          {isLoadingSuggestions ? "Loading..." : "Suggest Messages"}
        </Button>
        <div className="mt-4">
          {isLoadingSuggestions ? (
            <p>Loading suggestions...</p>
          ) : (
            suggestedMessages.length > 0 && (
              <div className="space-y-2">
                {suggestedMessages.map((message, index) => (
                  <div
                    key={index}
                    onClick={() => handleSuggestedMessageClick(message)}
                    className="border p-2 my-2 rounded cursor-pointer hover:bg-gray-200 transition"
                  >
                    {message}
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageComponent;
