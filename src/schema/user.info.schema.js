import Schema from "mongoose";

export const UserInfoSchema = {
    phone: String,
    displayName: String,
    role: {
        type: String,
        enum: ['teacher', 'student', 'admin'],
        require: true,
    },

    mail: {
        type: String,
        unique: true
    },

    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
    
}