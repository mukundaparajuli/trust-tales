import mongoose, { Schema } from "mongoose";

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
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    project: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now(),
    },
});


const messageModel =
    (mongoose.models.Message as mongoose.Model<Message>) ||
    mongoose.model<Message>("Message", messageSchema);

export default messageModel;