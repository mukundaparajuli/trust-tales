"use client";

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Message } from "@/models/messages";
import { ApiResponse } from "../../../../types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw, Copy, MessageSquare, ExternalLink, Eye } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { Question } from "@/models/question";
import { useForm } from "react-hook-form";
import { acceptMessageSchema } from "@/schema/acceptMessageSchema";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { questionSchema } from "@/schema/questionSchema";
import { string, z } from "zod";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function UserDashboard() {
  const [questionAnswerArray, setQuestionAnswerArray] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [uuidLink, setUuidLink] = useState<null | string>(null);
  const router = useRouter();

  const { toast } = useToast();
  const { data: session } = useSession();

  const baseUrl = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : '';
  const profileUrl = `${baseUrl}/u/${uuidLink}`;

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
      title: "Copied to clipboard",
      description: "Share this link to receive anonymous responses.",
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
        console.log("Fetched questions:", response.data.questions);
        setQuestionAnswerArray(response.data.questions ?? []);

        if (refresh) {
          toast({
            title: "Refreshed",
            description: "Showing latest responses",
          });
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
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

  const handleGenerateLink = async (data: z.infer<typeof questionSchema>) => {
    try {
      const response = await axios.post<ApiResponse>(`/api/generate-question-uuid/`, {
        question: data.question,
      });
      const question = response.data.question;
      if (!question) {
        toast({
          title: "Error",
          description: "No question returned from server",
          variant: "destructive",
        });
        return;
      }

      setUuidLink(question.uuid);

      toast({
        title: "Question Created!",
        description: "Your shareable link is ready. Copy it below.",
      });
      formQuestions.reset();
      fetchMessages();
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
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-semibold text-gray-900 mb-1">Dashboard</h1>
          <p className="text-gray-500 text-sm">Create questions and manage responses</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wide">Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-light text-gray-900">{questionAnswerArray.length}</div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wide">Responses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-light text-gray-900">
                {questionAnswerArray.reduce((acc, q) => acc + (q.messages?.length || 0), 0)}
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-light text-gray-900">{acceptMessages ? "Active" : "Paused"}</div>
            </CardContent>
          </Card>
        </div>

        {/* Create Question Card */}
        <Card className="mb-8 border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-900">Create Question</CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Generate a shareable link for anonymous responses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...formQuestions}>
              <form onSubmit={formQuestions.handleSubmit(handleGenerateLink)} className="space-y-4">
                <FormField
                  control={formQuestions.control}
                  name="question"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Question</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What would you like to ask?"
                          className="resize-none border-gray-300 focus:border-gray-900 focus:ring-gray-900 min-h-24"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="bg-gray-900 hover:bg-gray-800 text-white">
                  Generate Link
                </Button>
              </form>
            </Form>

            {/* Share Link Section */}
            {uuidLink && (
              <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Shareable Link
                </h3>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={profileUrl}
                    disabled
                    className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-600"
                  />
                  <Button onClick={copyToClipboard} variant="outline" className="border-gray-300">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Settings Card */}
        <Card className="mb-8 border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-900">Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Accept Responses</p>
                <p className="text-sm text-gray-500 mt-0.5">
                  {acceptMessages
                    ? "Currently accepting responses"
                    : "Paused accepting responses"}
                </p>
              </div>
              <Switch
                {...register("acceptMessages")}
                checked={!!acceptMessages}
                onCheckedChange={handleSwitchChange}
                disabled={isSwitchLoading}
              />
            </div>
          </CardContent>
        </Card>

        {/* Questions and Responses */}
        <Card className="border-gray-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-medium text-gray-900">Questions & Responses</CardTitle>
                <CardDescription className="text-sm text-gray-500">View anonymous responses</CardDescription>
              </div>
              <Button
                onClick={() => fetchMessages(true)}
                variant="outline"
                size="sm"
                disabled={isLoading}
                className="border-gray-300"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCcw className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {questionAnswerArray && questionAnswerArray.length > 0 ? (
              <div className="space-y-6">
                {questionAnswerArray.map((item) => (
                  <div key={String(item._id)} className="border border-gray-200 rounded-md p-5">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-medium text-base text-gray-900 flex-1">
                        {item.question}
                      </h3>
                      <div className="flex items-center gap-2 ml-4">
                        <span className="text-xs text-gray-400 whitespace-nowrap">
                          {item.messages?.length || 0} {item.messages?.length === 1 ? 'response' : 'responses'}
                        </span>
                        {item.messages && item.messages.length > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/questions/${item._id}`)}
                            className="border-gray-300 text-gray-600 hover:text-gray-900 whitespace-nowrap"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View All
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Responses */}
                    {item && item.messages && item.messages.length > 0 ? (
                      <div className="space-y-2">
                        {item.messages.map((message: any) => (
                          <div
                            key={String(message._id)}
                            className="bg-gray-50 p-3 rounded-md border border-gray-100 hover:border-gray-300 cursor-pointer transition-colors"
                            onClick={() => router.push(`/templates/${message._id}`)}
                          >
                            <p className="text-sm text-gray-700">{message.message}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-gray-400">
                                {new Date(message.createdAt).toLocaleString()}
                              </span>
                              <ExternalLink className="h-3 w-3 text-gray-300" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-gray-50 rounded-md border border-gray-200">
                        <MessageSquare className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No responses yet</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-base font-medium text-gray-900 mb-1">No questions yet</h3>
                <p className="text-sm text-gray-500">Create your first question to get started</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default UserDashboard;
