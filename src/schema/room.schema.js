import Schema from "mongoose";
export const RoomSchema = {
    name: {
        type: String,
    },
    
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
    userList:[
        {
            type: Schema.ObjectId,
            ref: 'User'
        }
    ]
}