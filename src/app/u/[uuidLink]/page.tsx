"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
import { Loader2, Sparkles, Send, MessageCircle, Lock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const MessageComponent = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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
      toast({
        title: "Suggestions Generated",
        description: "Click on any suggestion to use it",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch suggested messages.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleGetQuestionInfo = async () => {
    try {
      const response = await axios.post("/api/get-question-from-uuid", {
        uuid: uuidLink,
      });
      const question = response.data.question;
      setQuestion(question.question);
      setUserId(response.data.question.user);
      setQuestionId(question._id);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load question. This link may be invalid.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsSubmitting(true);

    if (!userId || !questionId) {
      toast({
        title: "Error",
        description: "Question information is missing. Please refresh and try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("message", data.message);
      formData.append("name", "");
      formData.append("project", "");
      formData.append("rating", "0");
      formData.append("questionId", questionId);

      const response = await axios.post<ApiResponse>("/api/send-messages/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      });

      toast({
        title: "Response Sent!",
        description: "Your anonymous response has been delivered.",
      });

      setSubmitted(true);
      form.reset();
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message || "Failed to send response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuggestedMessageClick = (message: string) => {
    form.setValue("message", message);
  };

  useEffect(() => {
    handleGetQuestionInfo();
  }, []);

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full border border-gray-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-medium text-gray-900">Thank You</CardTitle>
            <CardDescription className="text-base mt-2">
              Your anonymous response has been sent successfully
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600 text-sm">
              Your honest feedback has been delivered anonymously. The recipient will never know who sent this.
            </p>
            <Button
              onClick={() => setSubmitted(false)}
              variant="outline"
              className="mt-4 border-gray-300"
            >
              Send Another Response
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <Card className="mb-8 border-gray-200 bg-white">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl md:text-3xl font-medium mb-2 text-gray-900">
              {question || "Loading..."}
            </CardTitle>
            <CardDescription className="text-sm flex items-center justify-center gap-2">
              <Lock className="h-4 w-4" />
              Your response is 100% anonymous
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-900">Your Anonymous Response</CardTitle>
            <CardDescription className="text-sm">
              Share your honest thoughts without revealing your identity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6"
              >
                <FormField
                  name="message"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Your Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write your honest response here..."
                          className="resize-none min-h-32 text-base border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gray-900 hover:bg-gray-800"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Response
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="mt-6 border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-900">
              Need Inspiration?
            </CardTitle>
            <CardDescription className="text-sm">
              Let AI suggest some response ideas (you can edit them)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={generateMessages}
              disabled={isLoadingSuggestions}
              variant="outline"
              className="w-full border-gray-300"
            >
              {isLoadingSuggestions ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Ideas...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Get AI Suggestions
                </>
              )}
            </Button>

            {suggestedMessages.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Click any suggestion to use it:
                </p>
                {suggestedMessages.map((message, index) => (
                  <div
                    key={index}
                    onClick={() => handleSuggestedMessageClick(message)}
                    className="p-4 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 hover:border-gray-300 transition-all"
                  >
                    <p className="text-sm text-gray-700">{message}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 p-4 bg-gray-100 border border-gray-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Lock className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-gray-900 mb-1 text-sm">Your Privacy is Protected</h4>
              <p className="text-sm text-gray-600">
                Your response is completely anonymous. No personal information is collected or tracked.
                The recipient will never know who sent this message.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageComponent;
