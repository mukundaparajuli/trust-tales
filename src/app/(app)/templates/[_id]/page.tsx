'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Message } from "@/models/messages";
import axios from "axios";
import { useEffect, useState } from "react";
import { Download, Share2, Copy, Check, MessageCircle, Calendar } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import html2canvas from 'html2canvas';

export default function Page({ params }: {
    params: {
        _id: string;
    }
}) {
    const [message, setMessage] = useState<Message | null>(null);
    const [copied, setCopied] = useState(false);
    const { toast } = useToast();
    const { _id } = params;

    const fetchMessage = async () => {
        try {
            const response = await axios.get(`/api/get-message/` + _id);
            setMessage(response.data.message)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load response",
                variant: "destructive",
            });
        }
    }

    useEffect(() => {
        fetchMessage();
    }, [])

    const handleCopyMessage = () => {
        if (message) {
            navigator.clipboard.writeText(message.message);
            setCopied(true);
            toast({
                title: "Copied",
                description: "Response text copied to clipboard",
            });
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleDownloadAsImage = async () => {
        const element = document.getElementById('response-card');
        if (element) {
            try {
                const canvas = await html2canvas(element, {
                    backgroundColor: '#ffffff',
                    scale: 2,
                });
                const link = document.createElement('a');
                link.download = `response-${_id}.png`;
                link.href = canvas.toDataURL();
                link.click();
                toast({
                    title: "Downloaded",
                    description: "Response card saved as image",
                });
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to download image",
                    variant: "destructive",
                });
            }
        }
    };

    if (!message) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-gray-500">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="container mx-auto max-w-3xl">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-3xl font-semibold text-gray-900 mb-1">Anonymous Response</h1>
                    <p className="text-sm text-gray-500">
                        {new Date(message.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                </div>

                {/* Shareable Card */}
                <div id="response-card" className="mb-8">
                    <Card className="border border-gray-200 bg-white shadow-sm">
                        <CardContent className="pt-8 pb-8">
                            <p className="text-lg text-gray-800 leading-relaxed">
                                {message.message}
                            </p>
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <p className="text-sm text-gray-500">
                                    Sent anonymously via WhisperLink
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 mb-12">
                    <Button
                        onClick={handleCopyMessage}
                        variant="outline"
                        className="w-full justify-start border-gray-200 hover:bg-gray-50"
                    >
                        {copied ? (
                            <>
                                <Check className="mr-2 h-4 w-4" />
                                Copied
                            </>
                        ) : (
                            <>
                                <Copy className="mr-2 h-4 w-4" />
                                Copy Text
                            </>
                        )}
                    </Button>

                    <Button
                        onClick={handleDownloadAsImage}
                        variant="outline"
                        className="w-full justify-start border-gray-200 hover:bg-gray-50"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Download as Image
                    </Button>

                    <Button
                        onClick={() => {
                            if (navigator.share) {
                                navigator.share({
                                    title: 'Anonymous Feedback',
                                    text: message.message,
                                }).catch(() => { });
                            } else {
                                handleCopyMessage();
                            }
                        }}
                        variant="outline"
                        className="w-full justify-start border-gray-200 hover:bg-gray-50"
                    >
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                    </Button>
                </div>

                {/* Info Section */}
                <div className="p-6 bg-white rounded-lg border border-gray-200">
                    <h3 className="font-medium text-gray-900 mb-2">
                        Want to collect anonymous feedback?
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Create your own account and start receiving honest, anonymous responses.
                    </p>
                    <Button className="bg-gray-900 hover:bg-gray-800 text-sm">
                        Get Started
                    </Button>
                </div>
            </div>
        </div>
    )
}