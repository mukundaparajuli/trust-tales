import mongoose, { Schema, Document } from "mongoose";



export interface Message extends Document {
    content: string;
    createdAt: Date;
}

const messageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now(),
    },
});


export interface Question extends Document {
    question: string;
    createdAt: Date;
    uuid: string,
    user: mongoose.Schema.Types.ObjectId;
    messages: [Message]
}


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
    }, messages: [messageSchema],
});


const questionModel =
    (mongoose.models.Question as mongoose.Model<Question>) ||
    mongoose.model<Question>("Question", questionSchema);

export default questionModel;