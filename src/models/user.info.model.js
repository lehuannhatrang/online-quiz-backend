import createSchema from "../schema/base.schema";
import mongoose from "mongoose";
import {UserInfoSchema} from "../schema/user.info.schema";
import diff from 'deep-diff';
import UserActionModel from "./user.action.model"

const userInfoSchema = createSchema(UserInfoSchema, false, 'user_info');

userInfoSchema.statics.getByUserId = async function (userId) {
    let result = await this.findOne({user: userId}).exec();
    return result ? result.toObject() : null;
}
userInfoSchema.statics.updateUserInfo= async function(userid, model, user){
    let objId = new mongoose.mongo.ObjectId(userid)
    const oldVersion = await this.findOne({user: objId}).exec();
    let id=oldVersion._id
        //Update
        model.updatedAt = new Date();
        model.updatedBy = user;
        await this.findByIdAndUpdate(id, model).exec();
        const result = await this.findById(id).exec();

        const oldValueToDiff = oldVersion.toObject();
        const newValueToDiff = result.toObject();

        delete oldValueToDiff.updatedAt;
        delete oldValueToDiff.updatedBy;
        delete oldValueToDiff.createdBy;

        delete newValueToDiff.updatedAt;
        delete newValueToDiff.updatedBy;
        delete newValueToDiff.createdBy;

        const differ = await diff(JSON.parse(JSON.stringify(oldValueToDiff)), JSON.parse(JSON.stringify(newValueToDiff)));
        await console.log(differ);
        if (await differ) {
            const action = await {
                type: 'UPDATE',
                user,
                collectionName: this.collection.name,
                diff: differ,
            }
            UserActionModel.create(action);
        }
        return result ? result.toObject() : null;
}
export default mongoose.model('UserInfo', userInfoSchema);

