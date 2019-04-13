import mongoose from 'mongoose';
import createSchema from "../schema/base.schema";
import {UserSchema} from "../schema/user.schema";

const userSchema = createSchema(UserSchema, false, 'users');

userSchema.virtual('userInfo', {
    ref: 'UserInfo',
    localField: '_id',
    foreignField: 'user',
    justOne: true,
});

//function static
userSchema.statics.getUserByUsername = async function (user) {
    let retUser = await this.findOne({ user }).exec();
    return retUser ? retUser.toObject() : null;
}



export default mongoose.model('User', userSchema);