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
import { string, z } from "zod";

function UserDashboard() {
  const [questionAnswerArray, setQuestionAnswerArray] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [uuidLink, setUuidLink] = useState<null | string>(null);


  const { toast } = useToast();




  const { data: session } = useSession();


  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${uuidLink}`;







  // delete message

  // const handleDeleteMessage = (messageId: string) => {
  //   setMessages(messages.filter((message) => message._id !== messageId));
  // };






  //forms

  const formAcceptMessages = useForm({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: { acceptMessages: false },
  });

  const formQuestions = useForm({
    resolver: zodResolver(questionSchema),
    defaultValues: { question: "" },
  });







  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "URL Copied!",
      description: "Profile URL has been copied to clipboard.",
    });
  };
  const { register, watch, setValue } = formAcceptMessages;
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessages = async () => {
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
  };

  const fetchMessages =
    async (refresh: boolean = false) => {
      setIsLoading(true);
      try {
        const response = await axios.get<ApiResponse>("/api/get-message");
        setQuestionAnswerArray(response.data.questions);
        console.log(questionAnswerArray);

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
      }
    };





  // handle switch change

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-message", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
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




  // handle generate link

  const handleGenerateLink = async (data: z.infer<typeof questionSchema>) => {
    console.log("into it", data.question);
    try {
      const response = await axios.post<ApiResponse>(`/api/generate-question-uuid/`, {
        question: data.question,
      });
      console.log(response.data);
      const { question } = response.data;
      console.log(question.uuid)

      setUuidLink(question.uuid)

      toast({
        title: "Success",
        description: response.data.message,
      });
      formQuestions.reset();


    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Error while generating the link",
        variant: "destructive",
      });
    }
  };



  useEffect(() => {
    if (!session || !session.user) return;

    fetchMessages();
    fetchAcceptMessages();
  }, [session]);




  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>
        {uuidLink && <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>}
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
        onClick={() => fetchMessages(true)}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      {/* <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={message?._id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div> */}

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
      </div>










      {/* show all the questions and messages */}
      <div>
        {questionAnswerArray && questionAnswerArray.map((item) => (
          <div key={item._id} className="mb-4">
            <div className="font-bold text-lg mb-2">
              {/* Display the question */}
              {item.question}
            </div>

            {/* Check if there are any messages */}
            {item.messages.length > 0 ? (
              <div className="ml-4">
                {item.messages.map((message) => (
                  <div key={message._id} className="bg-gray-100 p-2 rounded mb-2">
                    {/* Display the message content */}
                    <p>{message.content}</p>
                    <span className="text-xs text-gray-500">
                      {new Date(message.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="ml-4 text-gray-500">No messages available</div>
            )}
          </div>
        ))}
      </div>


























    </div>
  );
}

export default UserDashboard;
