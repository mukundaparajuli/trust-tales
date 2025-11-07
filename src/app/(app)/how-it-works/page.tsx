"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Link as LinkIcon, MessageSquare, Share2, Eye } from "lucide-react";
import Link from "next/link";

export default function HowItWorks() {
    return (
        <div className="min-h-screen bg-white py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        How WhisperLink Works
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Get honest, anonymous feedback in just 4 simple steps
                    </p>
                </div>

                {/* Steps */}
                <div className="space-y-12 mb-16">
                    {/* Step 1 */}
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-shrink-0 w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold">
                            1
                        </div>
                        <Card className="flex-1">
                            <CardHeader>
                                <div className="flex items-center gap-3 mb-2">
                                    <CheckCircle2 className="h-8 w-8 text-black" />
                                    <CardTitle className="text-2xl">Create an Account</CardTitle>
                                </div>
                                <CardDescription className="text-base">
                                    Sign up for free in less than a minute. No credit card required.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700">
                                    Simply provide your email, choose a username, and verify your account.
                                    You&apos;ll have access to all features immediately.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-shrink-0 w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold">
                            2
                        </div>
                        <Card className="flex-1">
                            <CardHeader>
                                <div className="flex items-center gap-3 mb-2">
                                    <LinkIcon className="h-8 w-8 text-black" />
                                    <CardTitle className="text-2xl">Create Your Question</CardTitle>
                                </div>
                                <CardDescription className="text-base">
                                    Write any question you want anonymous feedback on.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 mb-4">
                                    In your dashboard, type your question in the text box. Examples:
                                </p>
                                <ul className="space-y-2 text-gray-600">
                                    <li className="flex items-start gap-2">
                                        <span className="text-black mt-1">•</span>
                                        <span>&quot;What do you honestly think about my content?&quot;</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-black mt-1">•</span>
                                        <span>&quot;How can I improve as a team leader?&quot;</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-black mt-1">•</span>
                                        <span>&quot;What&apos;s your honest opinion about my presentation?&quot;</span>
                                    </li>
                                </ul>
                                <p className="text-gray-700 mt-4">
                                    Click &quot;Generate Link&quot; and get a unique shareable URL instantly.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-shrink-0 w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold">
                            3
                        </div>
                        <Card className="flex-1">
                            <CardHeader>
                                <div className="flex items-center gap-3 mb-2">
                                    <Share2 className="h-8 w-8 text-black" />
                                    <CardTitle className="text-2xl">Share Your Link</CardTitle>
                                </div>
                                <CardDescription className="text-base">
                                    Distribute your unique link to collect responses.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 mb-4">
                                    Share your link anywhere:
                                </p>
                                <div className="grid md:grid-cols-2 gap-3">
                                    <div className="bg-gray-100 p-3 rounded-lg border border-black">
                                        <p className="font-semibold text-black">Social Media</p>
                                        <p className="text-sm text-gray-700">Twitter, Instagram, Facebook</p>
                                    </div>
                                    <div className="bg-gray-100 p-3 rounded-lg border border-black">
                                        <p className="font-semibold text-black">Direct Messages</p>
                                        <p className="text-sm text-gray-700">WhatsApp, Telegram, Discord</p>
                                    </div>
                                    <div className="bg-gray-100 p-3 rounded-lg border border-black">
                                        <p className="font-semibold text-black">Email</p>
                                        <p className="text-sm text-gray-700">Send to your mailing list</p>
                                    </div>
                                    <div className="bg-gray-100 p-3 rounded-lg border border-black">
                                        <p className="font-semibold text-black">QR Code</p>
                                        <p className="text-sm text-gray-700">Print or display anywhere</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Step 4 */}
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-shrink-0 w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold">
                            4
                        </div>
                        <Card className="flex-1">
                            <CardHeader>
                                <div className="flex items-center gap-3 mb-2">
                                    <Eye className="h-8 w-8 text-black" />
                                    <CardTitle className="text-2xl">Receive & View Responses</CardTitle>
                                </div>
                                <CardDescription className="text-base">
                                    Get notified and view all anonymous responses in your dashboard.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 mb-4">
                                    When someone responds to your question:
                                </p>
                                <ul className="space-y-2 text-gray-600">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-black mt-0.5" />
                                        <span>You&apos;ll receive an email notification (optional)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-black mt-0.5" />
                                        <span>View all responses organized by question in your dashboard</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-black mt-0.5" />
                                        <span>The responder&apos;s identity stays 100% anonymous</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-black mt-0.5" />
                                        <span>Export or share responses with beautiful templates</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Privacy Section */}
                <Card className="mb-12 bg-white border-2 border-black">
                    <CardHeader>
                        <CardTitle className="text-2xl">Your Privacy is Our Priority</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold text-lg mb-2">For Question Askers:</h3>
                                <ul className="space-y-2 text-gray-700">
                                    <li>• Your questions are only visible via the unique link</li>
                                    <li>• Control who can respond by sharing selectively</li>
                                    <li>• Pause or delete questions anytime</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-2">For Responders:</h3>
                                <ul className="space-y-2 text-gray-700">
                                    <li>• No login or account required to respond</li>
                                    <li>• No tracking or identification</li>
                                    <li>• Complete anonymity guaranteed</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* CTA */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Ready to Get Started?
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Join thousands of users getting honest feedback today
                    </p>
                    <Link href="/sign-up">
                        <Button className="bg-black hover:bg-gray-800 text-lg px-8 py-6">
                            Create Free Account
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
