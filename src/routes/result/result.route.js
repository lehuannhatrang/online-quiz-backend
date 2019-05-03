import express from 'express';
import {ResultModel,RoomModel, QuizModel, QuestionModel} from '../../models';
import HttpUtil from "../../utils/http.util";
import {Error} from "..//../errors/Error";
import { runInNewContext } from 'vm';

const ResultRouter = express.Router();
var markScore = function(userAnswers, quizAnswer){
    // Check whether the number of user-quiz's answers is matched
    if (userAnswers.length != quizAnswer.length){
        return HttpUtil.makeErrorResponse(res, Error.BAD_REQUEST);
    } 
    var numQuestion = quizAnswer.length;
    var numIncorrect = 0;
    var i;
    for (i = 0; i < numQuestion; i++){
        if (userAnswers[i] !== quizAnswer[i]){
            numIncorrect++;
        }
    }

    return Math.floor(10 * (numQuestion - numIncorrect) / numQuestion);
}
ResultRouter.post('/', async (req, res)=>{
    //Check whether this result is exactly user's result
    var userResult = req.body;
    
    if (userResult.user !== req.user.sub){
        return HttpUtil.makeErrorResponse(res, Error.WRONG_USER);
    }
    // get user's answers
    const userAnswers = userResult.userAnswer;
    // get quiz's answers
    var quizAnswer = [];

    if (userResult.room != null){
        // get quiz's answers from room
        var quizId, questionIdList, answer;
        await RoomModel.findOne({_id:userResult.room},(err, res)=>{
            quizId = res.QuizId;
        });
        await QuizModel.findOne({_id:quizId}, (err, res)=>{
            questionIdList = res.question;
        })
        
        //console.log(questionIdList);
        // await questionIdList.forEach(async element => {
        //     await QuestionModel.findOne({_id:element}, (err, res)=>{
        //         answer = res.answer;
        //         quizAnswer.push(answer);
        //     }) 
        //     //console.log(quizAnswer);
        // }); 
        var j;
        for (j = 0; j < questionIdList.length; j++){
            await QuestionModel.findOne({_id:questionIdList[j]}, (err, res)=>{
                quizAnswer.push(res.answer);
            }); 
        }
        
    }
    
    //Score the mark
    let score = markScore(userAnswers, quizAnswer);
    console.log(score);
    userResult.score = score;
    
    //userResult.quizAnswer = quizAnswer;
    //save to database
    var newResult = new ResultModel(userResult);
    newResult.save(function (err, post){
        if (err){
            return next(err);
        }
        // WARNING: JUST FOR DEBUG, needed remove 
        // this response
        res.json(201, post);
    })
    
})
export default ResultRouter;