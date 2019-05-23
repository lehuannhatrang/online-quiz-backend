import express from 'express';
import {QuizModel, QuestionModel} from '../../models';
import HttpUtil from "../../utils/http.util";
import {Error} from "..//../errors/Error";
import mongoose from "mongoose";

const QuizRouter = express.Router();

// Get user's quiz list
QuizRouter.get('/', (req, res)=>{
    const userId = req.user.sub;
    
    QuizModel.getByQuery({user: userId})
        .then(async quizzes => {
            var i;
            for (i = 0; i < quizzes.length; i++){
                var idQuestionList = quizzes[i].question;
                var questionList = []
                var j;

                for (j = 0; j < idQuestionList.length; j++){
                    var question;
                    await QuestionModel.getById(idQuestionList[j]).then((result)=>{
                        
                        question = result;
                    })
                    questionList.push(question);
                }
                quizzes[i].set('questions', questionList,{strict: false});
                delete quizzes[i].question;
            } 
            HttpUtil.makeJsonResponse(res, quizzes)
        })
        .catch(err => {
            console.log(err);
            HttpUtil.makeErrorResponse(res, Error.ITEM_NOT_FOUND);
        })
})

// Get public quiz list
QuizRouter.get('/public', async (req, res)=>{
    QuizModel.getByQuery(
            {$or: [
                {isPublic: true},
                {
                    shareWith:{$all:[req.user.sub]}
                }
            
            ]}
        )
        .then(async quizzes => {
            //var quizzes = quizzes;  
            var i;
            for (i = 0; i < quizzes.length; i++){
                var idQuestionList = quizzes[i].question;
                var questionList = []
                var j;

                for (j = 0; j < idQuestionList.length; j++){
                    var question;
                    await QuestionModel.getById(idQuestionList[j]).then((result)=>{
                        
                        question = result;
                    })
                    questionList.push(question);
                }
                quizzes[i].set('questions', questionList,{strict: false});
                delete quizzes[i].question;
            } 
            //console.log(listQuestionId);

            HttpUtil.makeJsonResponse(res, quizzes)
        })
        .catch(err => {
            return next(err);
        })
})

//get quiz by id, 
//req: header must have id field
QuizRouter.get('/id', (req, res)=>{
    const quizIdRequest = req.headers.id;
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
        return HttpUtil.makeJsonResponse(res, quiz);
    })
})

QuizRouter.post('/', async (req, res)=>{
    var questions;
    await QuestionModel.createListQuestions(req.body.questions).then(result=>{
        questions = result
    })
    var createPost = {
        name: req.body.name,
        isPublic: req.body.isPublic ? req.body.isPublic: true,
        shareWith: req.body.shareWith,
        user: req.body.user,
        question: questions
    }
    //createPost = req.user.sub;
    QuizModel.createModel(createPost,req.user.sub)
        .then(result => HttpUtil.makeJsonResponse(res, result))
        .catch(err=>HttpUtil.makeErrorResponse(res,err))
    // var newQuiz = new QuizModel(createPost);
    // newQuiz.save(function (err, post){
    //     if (err){ 
    //         console.log(err);
    //         return next(err)}
    //     res.json(201, post)
    // })
})

QuizRouter.put('/', async (req, res)=>{
    // if (quizModifyModel.user !== req.user.sub){
    //     return HttpUtil.makeErrorResponse(res, Error.WRONG_USER);
    // }
    const quizModifyModel = req.body;
    var owner;
    var quiz;
    await QuizModel.findOne({_id:quizModifyModel.id}, (err, q)=>{
        owner = q.user;
        quiz = q;
    })
    if (owner != req.user.sub){
        return HttpUtil.makeErrorResponse(res, Error.WRONG_USER);
    }
    // delete old question
    let status = await QuestionModel.deleteListQuestions(quiz.question, req.user.sub);
    console.log(status);
    // recreate new question
    var questions;
    await QuestionModel.createListQuestions(req.body.questions).then(result=>{
        questions = result;
    })
    quizModifyModel.question = questions;
    var newModelToUpdate = {
        name:quizModifyModel.name,
        isPublic:quizModifyModel.isPublic,
        user: req.user.sub,
        question: questions
    }
    QuizModel.updateModel(quizModifyModel.id,newModelToUpdate,req.user.sub)
    .then(result => HttpUtil.makeJsonResponse(res, result))
    .catch(err=>HttpUtil.makeErrorResponse(res,err))
    // QuizModel.findByIdAndUpdate(quizModifyModel.id, newModelToUpdate, function (err, doc){
    //     if (err){
    //         return next(err);
    //     }
    //     res.json(201, doc);
    // })
})
// delete need 
QuizRouter.delete('/',async (req, res)=>{
    const quizDeleteModel = req.query;
    var owner;
    var quiz;
    await QuizModel.findOne({_id:quizDeleteModel.id}, (err, q)=>{
        if (q == null){
            return HttpUtil.makeErrorResponse(res, Error.ITEM_NOT_FOUND);
        }
        owner = q.user;
        quiz = q;
    })
    console.log(owner);
    console.log(req.user.sub);
    if (owner != req.user.sub){
        return HttpUtil.makeErrorResponse(res, Error.WRONG_USER);
    }
    let status = await QuestionModel.deleteListQuestions(quiz.question, req.user.sub);
    console.log(status);
    // QuizModel.findByIdAndRemove(quizDeleteModel.id, function (err, doc){
    //     if (err){
    //         return next(err);
    //     }
    //     HttpUtil.makeHttpResponse(res, doc);
    // })
    var result = await QuizModel.deleteModel1(quizDeleteModel.id, req.user.sub);
    res.json(201, result);
    
})

export default QuizRouter;