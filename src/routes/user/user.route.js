import express from 'express';
import { UserModel, UserInfoModel ,SchoolModel} from '../../models';
import HttpUtil from "../../utils/http.util";
import {Error} from "../../errors/Error";
import mongoose from "mongoose";

const UserRouter = express.Router();

UserRouter.get('/list', (req, res) => {
    UserModel.list(['userInfo'], '-password')
        .then(users => {
            HttpUtil.makeJsonResponse(res, users)
        })
        .catch(err => {
            console.log(err)
            HttpUtil.makeErrorResponse(res, Error.UN_AUTHORIZATION)
        })
})

UserRouter.get('/', (req, res) => {
    const userId = req.user.sub;
    UserModel.getById(userId, 'userInfo')
        .then(user => {
            if (user) {
                HttpUtil.makeJsonResponse(res, user);
            } else {
                HttpUtil.makeErrorResponse(res, Error.ITEM_NOT_FOUND);
            }
        })
        .catch(err => {
            console.log(err)
            HttpUtil.makeErrorResponse(res, Error.UN_AUTHORIZATION);
        })
})

UserRouter.post('/', (req, res) => {
    let createUser = req.body;
    createUser.status = 'ACTIVATED';
    UserModel.createModel(createUser, req.user.sub)
        .then(user => HttpUtil.makeJsonResponse(res, user));
})

UserRouter.put('/', (req, res) => {
    UserModel.updateModel(req.body.id, req.body, req.user.sub)
        .then(user => HttpUtil.makeJsonResponse(res, user));
})

UserRouter.put('/info', (req, res) => {
    const userInfoModifyModel = req.body
    if (userInfoModifyModel.user !== req.user.sub)
        return HttpUtil.makeErrorResponse(res, Error.WRONG_USER)
    UserInfoModel.getByUserId(userInfoModifyModel.user).then(result=>{
        if(result === null)
            return HttpUtil.makeErrorResponse(res,Error.NOT_FOUND_INFO)
    })
    UserInfoModel.updateUserInfo(userInfoModifyModel.user,userInfoModifyModel, req.user.sub).then(        
        result=>{
            return HttpUtil.makeJsonResponse(res, result)
        }
    )
})
UserRouter.get('/info', (req, res) => {
    const userId = req.user.sub;
    UserInfoModel.getByUserId(userId)
        .then(result => {
            if (result) {
                UserInfoModel.getById(result._id,["user","school"]).then(result1=>
                    HttpUtil.makeHttpResponse(res,result1)
                )
            } else {
                HttpUtil.makeErrorResponse(res, Error.ITEM_NOT_FOUND);
            }
        })
        .catch(err => {
            console.log(err)
            HttpUtil.makeErrorResponse(res, Error.UN_AUTHORIZATION);
        })
})
UserRouter.post('/info',async (req,res)=>{
    const createUserInfo = req.body
    // if (createUserInfo.user !== req.user.sub)
    //     return HttpUtil.makeErrorResponse(res, Error.WRONG_USER)
    
    UserInfoModel.getByUserId(createUserInfo.user).then(result => {
        if(result !== null) 
            return HttpUtil.makeErrorResponse(res, Error.ITEM_EXISTED)
    })

    createUserInfo.user = await new mongoose.mongo.ObjectId(createUserInfo.user)
    UserInfoModel.createModel(createUserInfo, req.user.sub).then(result=>{
        HttpUtil.makeHttpResponse(res,result)
    })
    
})
UserRouter.put('/info/school',async (req,res)=>{
    SchoolModel.createModel(req.body,req.user.sub).then(result=>{
        UserInfoModel.getByUserId(req.user.sub).then(result1=>{
            if(result1.school!==null){
                SchoolModel.deleteModel(result1.school,req.user.sub)
            }
            UserInfoModel.updateModel(result1._id,{school:result._id},req.user.sub).then(result2=>{
                HttpUtil.makeJsonResponse(res,result2)
            })
        })
    })
})

export default UserRouter;