import mongoose, { Schema, Document, Model } from "mongoose";

export interface Message extends Document {
    message: string;
    name: string;
    project: string,
    photo: string;
    rating: number;
    createdAt: Date;
}

const messageSchema: Schema<Message> = new Schema({
    name: {
        type: String,
        required: false, // Made optional for anonymous messages
    },
    message: {
        type: String,
        required: true,
    },
    project: {
        type: String,
        required: false, // Made optional for anonymous messages
    },
    photo: {
        type: String,
        required: false, // Made optional for anonymous messages
    },
    rating: {
        type: Number,
        required: false, // Made optional for anonymous messages
        default: 0,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

const MessageModel: Model<Message> = mongoose.models.Message || mongoose.model<Message>("Message", messageSchema);

export default MessageModel;