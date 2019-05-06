export const UserSchema = {
    user: {
        type: String,
        unique: true,
        require: true,
        trim: true
    },
    password: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['ACTIVATED', 'DISABLED'],
    },
}