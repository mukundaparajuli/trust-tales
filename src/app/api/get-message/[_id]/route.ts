import dbConnect from '@/lib/dbConnection';
import MessageModel from '@/models/messages';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { _id: string } }) {
    await dbConnect();
    const { _id } = params;

    try {
        if (_id) {
            const message = await MessageModel.findById(_id);
            if (!message) {
                return new Response(
                    JSON.stringify({ success: false, message: "Message not found" }),
                    { status: 404 }
                );
            }

            return new Response(
                JSON.stringify({ success: true, message }),
                { status: 200 }
            );
        }

        const messages = await MessageModel
            .find({})
            .sort({ createdAt: -1 })


        if (!messages.length) {
            return new Response(
                JSON.stringify({ success: false, message: "No messages found" }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({ success: true, messages }),
            { status: 200 }
        );
    } catch (error) {
        console.log("Error fetching message(s):", error);
        return new Response(
            JSON.stringify({ success: false, message: "An error occurred" }),
            { status: 500 }
        );
    }
}
