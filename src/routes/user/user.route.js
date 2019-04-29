import express from 'express';
import { UserModel, UserInfoModel,QuestionModel,QuizModel } from '../../models';
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
UserRouter.post('/info',async (req,res)=>{
    const createUserInfo = req.body
    if (createUserInfo.user !== req.user.sub)
        return HttpUtil.makeErrorResponse(res, Error.WRONG_USER)
    
    UserInfoModel.getByUserId(createUserInfo.user).then(result => {
        if(result !== null) 
            return HttpUtil.makeErrorResponse(res, Error.DUPLICATED_USER_INFO)
    })

    createUserInfo.user = await new mongoose.mongo.ObjectId(createUserInfo.user)
    UserInfoModel.createModel(createUserInfo, req.user.sub)
    
})
//get all questions in quiz
UserRouter.get('/quiz',(req,res)=>{
    //req: quizid
    QuestionModel.getQuestionsByQuiz(req.body.id).then(result=>{
        console.log(result)
        HttpUtil.makeJsonResponse(res,result.questions)
    })
})
//get a question in quiz
UserRouter.get('/quizindex',(req,res)=>{
    //req: quizid
    QuestionModel.getQuestionsByQuiz(req.body.id).then(result=>{
        HttpUtil.makeJsonResponse(res,result.questions[req.body.index])
    })
})

export default UserRouter;