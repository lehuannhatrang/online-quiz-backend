import express from 'express';
import { UserModel, UserInfoModel,RoomModel, QuestionModel,QuizModel } from '../../models';
import HttpUtil from "../../utils/http.util";
import {Error} from "../../errors/Error";
import mongoose from "mongoose";

const RoomRouter = express.Router();

RoomRouter.get('/list', async (req, res) => {
    if (req.query.roomId != ""){
        var idRoom, room;
        idRoom = req.query.roomId;
        
        await RoomModel.getById(idRoom,null)
            .then(result => {
                room = result;
            });
        
        if (!(room.userList.indexOf(req.user.sub) > -1)){
            room.userList.push(req.user.sub);
        }
        console.log(room.userList);
        const quizIdRequest = room.QuizId;
        QuizModel.findOne({_id:quizIdRequest}, async (err, quiz)=>{
            if(err){
                return HttpUtil.makeErrorResponse(res, Error.ITEM_NOT_FOUND);
            }
            if (!quiz){
                return HttpUtil.makeErrorResponse(res, Error.ITEM_NOT_FOUND);
            }
            if (req.user.sub != quiz.user){
                return HttpUtil.makeErrorResponse(res, Error.WRONG_USER);
            }
            var idQuestionList = quiz.question;
            var questionList = []
            var j;

            for (j = 0; j < idQuestionList.length; j++){
                var question;
                await QuestionModel.getById(idQuestionList[j]).then((result)=>{
                    question = result;
                })
                questionList.push(question);
            }
            quiz.set('questions', questionList,{strict: false});
            delete quiz.question;   
            room.quiz = await quiz;
            delete room.userList;
            console.log(typeof(quiz));
            console.log(typeof(room));
            //room.set('quiz', quiz, {strict:false});
            
            HttpUtil.makeJsonResponse(res, room);
    })}
    else{
        RoomModel.list(['quizID','Report'],'-userList')
            .then(result => {
                HttpUtil.makeJsonResponse(res, result)
            });
    }
    
})

RoomRouter.get('/owner', (req, res) => {
    RoomModel.getById(req.body.id,'Owner','Owner')
        .then(result => {
            HttpUtil.makeJsonResponse(res, result)
        })
       
})
RoomRouter.get('/', (req, res) => {
    RoomModel.getById(req.body.id,null)
        .then(result => {
            HttpUtil.makeJsonResponse(res, result)
        })
       
})
RoomRouter.get('/quiz', (req, res) => {
    RoomModel.getById(req.body.id,'quizId','quizId')
        .then(result => {
            HttpUtil.makeJsonResponse(res, result)
        })
 
})
// RoomRouter.get('/report', (req, res) => {
//     RoomModel.getById(req.body.id,'quizId','quizId')
//         .then(result => {
//             HttpUtil.makeJsonResponse(res, result)
//         })
 
// })
RoomRouter.put('/', (req, res) => {
    req.body.startTime = new Date(req.body.startTime)
    RoomModel.getById(req.body.id,'Owner','Owner')
        .then(result => {
            if(result.id!=req.user.sub){
                return HttpUtil.makeErrorResponse(res, Error.WRONG_USER)
            }
            RoomModel.updateModel(req.body.id,req.body,req.user.sub)
            .then(result => HttpUtil.makeJsonResponse(res, result))
            .catch(err=>HttpUtil.makeErrorResponse(res,err))
        })

})
RoomRouter.post('/', (req,res)=>{
    req.body.startTime = new Date(req.body.startTime)
    req.body.Owner=req.user.sub
    RoomModel.createModel(req.body,req.user.sub)
        .then(result => HttpUtil.makeJsonResponse(res, result))
        .catch(err=>HttpUtil.makeErrorResponse(res,err))
})

RoomRouter.delete('/',async (req,res)=>{
    console.log(req.query.id)
    RoomModel.deleteModel(req.query.id,req.user.sub)
    HttpUtil.makeHttpResponse(res,{id:req.query.id,status:"done"})
})
export default RoomRouter;