import { Schema } from "mongoose";

export const ReportSchema = {
    name: {
        type: String,
        require: true,
    },

    summary: [[{
        type: Number,
    }]],

    results: [{
        type: Schema.ObjectId,
        ref: 'Result'
    }],
    roomID:{
        type: Schema.ObjectId,
        ref: 'Room'
    }
}