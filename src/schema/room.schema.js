import Schema from "mongoose";
export const RoomSchema = {
    QuizId: {
        type: Schema.ObjectId,
        require:true,
        ref:"Quiz"
    },
    startTime: {
        type: Date,
        require:true
    },
    Duration:{
        type:Number,
        require:true
    },
    Owner:{
        type:Schema.ObjectId,
        ref:"User",
        require:true 
    },
    Report: {
        type: Schema.ObjectId,
        ref:"Report",
        require: true
    }
}