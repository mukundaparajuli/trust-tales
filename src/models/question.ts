import mongoose, { Schema, Document } from "mongoose";


export interface Question extends Document {
    question: string;
    createdAt: Date;
    uuid: string,
    user: mongoose.Schema.Types.ObjectId;
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
    }
});


const questionModel =
    (mongoose.models.Message as mongoose.Model<Question>) ||
    mongoose.model<Question>("Message", questionSchema);

export default questionModel;