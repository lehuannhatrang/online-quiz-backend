import {Schema} from "mongoose";

export const ResultSchema = {
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },

    room: {
        type: Schema.ObjectId,
        ref: 'Room'
    },

    score: {
        type: Number,
        require: true,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer value'
        }

    }, 

    userAnswer: [
        {
            type: String,
            require: true,
            lowercase: true,
            trim: true
        }
    ],
 
    quizAnswer: [
        {
            type: String,
            require: true,
            lowercase: true,
            trim: true
        }
    ]
}