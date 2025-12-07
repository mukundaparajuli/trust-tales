"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import { Question } from "@/models/question";
import { Message } from "@/models/messages";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquare, Loader2, Star } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ApiResponse } from "../../../../../types/ApiResponse";

export default function QuestionResponsesPage() {
    const [question, setQuestion] = useState<Question | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const params = useParams();
    const { toast } = useToast();

    const questionId = params.questionId as string;

    useEffect(() => {
        const fetchQuestionResponses = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get<ApiResponse>(
                    `/api/get-question-responses/${questionId}`
                );

                if (response.data.success && response.data.question) {
                    setQuestion(response.data.question);
                } else {
                    toast({
                        title: "Error",
                        description: response.data.message || "Failed to load question",
                        variant: "destructive",
                    });
                    router.push("/dashboard");
                }
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>;
                toast({
                    title: "Error",
                    description:
                        axiosError.response?.data.message || "Failed to load question responses",
                    variant: "destructive",
                });
                router.push("/dashboard");
            } finally {
                setIsLoading(false);
            }
        };

        if (questionId) {
            fetchQuestionResponses();
        }
    }, [questionId, router, toast]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        );
    }

    if (!question) {
        return null;
    }

    const messages = (question?.messages || []) as any;

    return (
        <div className="min-h-screen bg-white py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    onClick={() => router.push("/dashboard")}
                    className="mb-6 text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                </Button>

                {/* Question Card */}
                <Card className="mb-8 border-gray-200">
                    <CardHeader>
                        <CardTitle className="text-2xl font-medium text-gray-900">
                            {question.question}
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-500 flex items-center gap-4 mt-2">
                            <span>
                                Created {new Date(question.createdAt).toLocaleDateString()}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span>
                                {messages.length} {messages.length === 1 ? "response" : "responses"}
                            </span>
                        </CardDescription>
                    </CardHeader>
                </Card>

                {/* Responses Section */}
                <Card className="border-gray-200">
                    <CardHeader>
                        <CardTitle className="text-lg font-medium text-gray-900">
                            All Responses
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {messages.length > 0 ? (
                            <div className="space-y-4">
                                {messages.map((message, index) => (
                                    <Card
                                        key={String(message._id)}
                                        className="border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
                                        onClick={() => router.push(`/templates/${message._id}`)}
                                    >
                                        <CardContent className="pt-6">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-medium text-gray-400">
                                                        Response #{index + 1}
                                                    </span>
                                                </div>
                                                {message.rating > 0 && (
                                                    <div className="flex items-center gap-1">
                                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                        <span className="text-sm text-gray-600">{message.rating}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <p className="text-base text-gray-700 mb-4 whitespace-pre-wrap">
                                                {message.message}
                                            </p>

                                            <div className="flex items-center justify-between text-sm text-gray-500">
                                                <div className="flex items-center gap-4">
                                                    {message.name && (
                                                        <span className="font-medium text-gray-700">{message.name}</span>
                                                    )}
                                                    {message.project && (
                                                        <span className="text-gray-500">{message.project}</span>
                                                    )}
                                                </div>
                                                <span className="text-xs text-gray-400">
                                                    {new Date(message.createdAt).toLocaleString()}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                <h3 className="text-base font-medium text-gray-900 mb-1">
                                    No responses yet
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Share your question link to receive anonymous responses
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
