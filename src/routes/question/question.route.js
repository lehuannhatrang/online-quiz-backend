import express from 'express';
import {QuestionModel } from '../../models';
import HttpUtil from "../../utils/http.util";
import {Error} from "../../errors/Error";
import mongoose from "mongoose";

const QuestionRouter = express.Router();

QuestionRouter.get('/list', (req, res) => {
    QuestionModel.list()
        .then(result => {
            HttpUtil.makeJsonResponse(res, result)
        })
    
})
QuestionRouter.get('/', (req, res) => {
    QuestionModel.getById(req.body.id)
        .then(result => {
            if (result) {
                HttpUtil.makeJsonResponse(res, result);
            } else {
                HttpUtil.makeErrorResponse(res, Error.ITEM_NOT_FOUND);
            }
        })
        .catch(err => {
            console.log(err)
            HttpUtil.makeErrorResponse(res, Error.UN_AUTHORIZATION);
        })
})

QuestionRouter.post('/', (req, res) => {
    UserModel.createModel(req.body, req.user.sub)
        .then(user => HttpUtil.makeJsonResponse(res, user));
})

QuestionRouter.put('/', (req, res) => {
    UserModel.updateModel(req.body.id, req.body, req.user.sub)
        .then(user => HttpUtil.makeJsonResponse(res, user));
})

export default QuestionRouter;