import mongoose, { Schema, Document } from "mongoose";

// Define Question interface
export interface Question extends Document {
    question: string;
    createdAt: Date;
    uuid: string;
    user: mongoose.Schema.Types.ObjectId;
    messages: mongoose.Schema.Types.ObjectId[]; // Reference to Message documents
}

// Question Schema
const questionSchema: Schema<Question> = new Schema({
    question: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now(),
    },
    uuid: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'  // Reference to Message model
    }]
});

const questionModel = mongoose.models.Question || mongoose.model<Question>("Question", questionSchema);

export default questionModel;
