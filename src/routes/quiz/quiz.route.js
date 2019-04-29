import express from 'express';
import {QuizModel} from '../../models';
import HttpUtil from "../../utils/http.util";
import {Error} from "..//../errors/Error";
import mongoose from "mongoose";

const QuizRouter = express.Router();

// Get user's quiz list
QuizRouter.get('/', (req, res)=>{
    const userId = req.user.sub;
    
    QuizModel.find({user: userId})
        .then(quizzes => {
            HttpUtil.makeJsonResponse(res, quizzes)
        })
        .catch(err => {
            console.log(err);
            HttpUtil.makeErrorResponse(res, Error.ITEM_NOT_FOUND);
        })
})

// Get public quiz list
QuizRouter.get('/public', (req, res)=>{
    QuizModel.find({isPublic: true})
        .then(quizzes => {
            HttpUtil.makeJsonResponse(res, quizzes)
        })
        .catch(err => {
            return next(err);
        })
})

QuizRouter.post('/', (req, res)=>{
    let createPost = req.body;
    createPost.user = req.user.sub;
    var newQuiz = new QuizModel(createPost);
    newQuiz.save(function (err, post){
        if (err){ 
            console.log(err);
            return next(err)}
        res.json(201, post)
    })
})


export default QuizRouter;