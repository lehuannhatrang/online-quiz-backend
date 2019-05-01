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

    return 10 * (numQuestion - numIncorrect) / numQuestion;
}
ResultRouter.post('/', (req, res)=>{
    //Check whether this result is exactly user's result
    if (userResult.user !== req.user.sub){
        return HttpUtil.makeErrorResponse(res, Error.WRONG_USER);
    }
    var userResult = req.body;
    // get user's answers
    const userAnswers = userResult.userAnswer;
    // get quiz's answers
    var quizAnswer = [];
    if (userResult.room != null){
        // get quiz's answers from room
        var quizQuestion= QuizModel
        .getById(
            RoomModel.getById(
                userResult.room
                , null, null).QuizId
                , null, null).question;
        quizQuestion.array.forEach(element => {
            quizAnswer.push(element.answer)
        });
    }
    console.log(quizAnswer);
    //Score the mark
    userResult.score = markScore(userAnswers, quizAnswer);
    
    userResult.quizAnswer = quizAnswer;
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