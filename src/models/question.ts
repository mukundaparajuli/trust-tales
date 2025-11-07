import mongoose, { Schema, Document, Model } from "mongoose";

// Define Question interface
export interface Question extends Document {
    question: string;
    createdAt: Date;
    uuid: string;
    user: mongoose.Schema.Types.ObjectId;
    messages: mongoose.Types.ObjectId[];
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
        default: Date.now,
    },
    uuid: {
        type: String,
        required: true,
        unique: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }]
});

const QuestionModel: Model<Question> = mongoose.models.Question || mongoose.model<Question>("Question", questionSchema);

export default QuestionModel;
