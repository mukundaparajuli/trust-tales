"use client";

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Message } from "@/models/user";
import { ApiResponse } from "../../../../types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { acceptMessageSchema } from "@/schema/acceptMessageSchema";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { questionSchema } from "@/schema/questionSchema";
import { z } from "zod";

function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [url, setUrl] = useState<null | String>(null);
  const [question, setQuestion] = useState<String>("");

  const { toast } = useToast();

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { data: session } = useSession();

  const formAcceptMessages = useForm({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: { acceptMessages: false },
  });
  const formQuestions = useForm({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: { question: "" },
  });

  const { register, watch, setValue } = formAcceptMessages;
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get("/api/accept-message");
      setValue("acceptMessages", response.data?.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Failed to fetch message settings",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>("/api/get-message");
        setMessages(response.data.messages || []);
        if (refresh) {
          toast({
            title: "Refreshed Messages",
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: "Error",
          description:
            axiosError.response?.data.message ?? "Failed to fetch messages",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages, toast]
  );

  // Fetch initial state from the server
  useEffect(() => {
    if (!session || !session.user) return;

    fetchMessages();
    fetchAcceptMessages();
  }, [session, setValue, toast, fetchAcceptMessages, fetchMessages]);

  // Handle switch change
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-message", {
        acceptMessages: !acceptMessages, // Toggle the boolean value
      });
      setValue("acceptMessages", !acceptMessages); // Update the value in the form
      toast({
        title: response.data.message,
        variant: "default",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Failed to update message settings",
        variant: "destructive",
      });
    }
  };

  if (!session || !session.user) {
    return <div></div>;
  }

  const { username } = session.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "URL Copied!",
      description: "Profile URL has been copied to clipboard.",
    });
  };





  // handle link generation
  const handleGenerateLink = async (data: z.infer<typeof questionSchema>) => {
    console.log("Submitting question: ", data.question); // Log the submitted question
    try {
      const response = await axios.post<ApiResponse>(`/api/generate-question-uuid/`, {
        question: data.question,
      });
      console.log("Response data: ", response.data); // Log response data
      toast({
        title: "Success",
        description: response.data.message,
      });
      const uuidLink = response.data; // Store the generated UUID link
      console.log("Generated UUID Link: ", uuidLink); // Log the UUID link
      formQuestions.reset(); // Reset the form after submission
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.error("Error during question submission: ", axiosError); // Log error details
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Error while generating the link",
        variant: "destructive",
      });
    }
  }

  return (
    <>
      <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
        <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{" "}
          <div className="flex items-center">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="input input-bordered w-full p-2 mr-2"
            />
            <Button onClick={copyToClipboard}>Copy</Button>
          </div>
        </div>

        <div className="mb-4">
          <Switch
            {...register("acceptMessages")}
            checked={!!acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
          />
          <span className="ml-2">
            Accept Messages: {acceptMessages ? "On" : "Off"}
          </span>
        </div>
        <Separator />
        <Button
          className="mt-4"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
        </Button>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <MessageCard
                key={message?._id}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <p>No messages to display.</p>
          )}
        </div>
        <div>
          {/* Create a question and generate uuid for the question along with the user */}
          <Separator />
          <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
            <h1 className="font-bold text-4xl mb-10 text-center">
              Your Question Here..
            </h1>
            <div className="my-8">
              <Form {...formQuestions}>
                <form onSubmit={formQuestions.handleSubmit(handleGenerateLink)} className="space-y-8">
                  <FormField
                    control={formQuestions.control}
                    name="question"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Question</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Type your message here."
                            className="resize-none border-black border-2 w-full"
                            {...field}
                            onChange={(e) => {
                              setQuestion(e.target.value); // Update your local question state (optional)
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Submit</Button>
                </form>
              </Form>
            </div>
            <Separator />
            <div className="mt-6">
            </div>
          </div></div>
      </div >
    </>
  );
}
export default UserDashboard;
