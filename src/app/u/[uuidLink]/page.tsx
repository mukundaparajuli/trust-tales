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
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ApiResponse } from "../../../../types/ApiResponse";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Star } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { headers } from "next/headers";

const MessageComponent = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const { toast } = useToast();
  const params = useParams();
  const { uuidLink } = params;
  const [question, setQuestion] = useState<null | string>();
  const [userId, setUserId] = useState(null);
  const [questionId, setQuestionId] = useState(null);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: "",
      name: "",
      project: "",
      photo: undefined,
      rating: 0,
    },
  });

  const generateMessages = async () => {
    setIsLoadingSuggestions(true);
    setSuggestedMessages([]);
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

  const handleGetQuestionInfo = async () => {
    console.log("getting the question info...");
    try {
      const response = await axios.post("/api/get-question-from-uuid", {
        uuid: uuidLink,
      });
      console.log(response.data);
      const question = response.data.question;
      setQuestion(question.question);
      const userKoId = response.data.question.user;
      setUserId(userKoId);

      setQuestionId(question._id);
      console.log("QUESTION KO ID:", question._id);
      console.log("user ko id: ", userKoId);
    } catch (error) {
      console.log("Error occurred while fetching the question information : ", error);
    }
  };

  const handleSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsSubmitting(true);
    console.log("trying to submit");

    if (!userId) {
      toast({
        title: "Error",
        description: "User ID is not available. Please try again.",
      });
      setIsSubmitting(false);
      return;
    }
    if (!questionId) {
      toast({
        title: "Error",
        description: "Question ID is not available. Please try again.",
      });
      setIsSubmitting(false);
      return;
    }



    try {
      console.log("fetching...");


      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("message", data.message);
      formData.append("name", data.name);
      formData.append("project", data.project);
      formData.append("photo", data.photo);
      formData.append("rating", data.rating);
      formData.append("questionId", questionId);

      const response = await axios.post<ApiResponse>("/api/send-messages/", formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          }
        });

      console.log("fetched...");
      console.log(response.data);
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
    form.setValue("message", message);
  };

  useEffect(() => {
    handleGetQuestionInfo();
  }, []);

  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="font-bold text-4xl mb-10 text-center">{question}</h1>
      <div className="my-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6 w-full"
          >
            <FormField
              name="message"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="message">Message</FormLabel>
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
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Full Name"
                      {...field} // Spread the field props
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="project"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="project">Project</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Project Name"
                      {...field} // Spread the field props
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="photo"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="photo">Upload Photo</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => field.onChange(e.target.files?.[0])} // Handle file upload
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="rating"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="rating">Rating</FormLabel>
                  <FormControl>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <Star
                          key={value}
                          className={`cursor-pointer ${field.value >= value ? "text-yellow-500" : "text-gray-300"}`}
                          onClick={() => field.onChange(value)}
                        />
                      ))}
                    </div>
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
