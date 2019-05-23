import { Schema } from "mongoose";

export const QuizSchema = {
    name: {
        type: String,
        require: true,
    },
    
    isPublic: {
        type: Boolean,
        require: true
    },
    shareWith: [
        {
            type: Schema.ObjectId,
            ref: 'User'
        }
    ],
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },

    question: [{
        type: Schema.ObjectId,
        ref: 'Question'
    }]
}