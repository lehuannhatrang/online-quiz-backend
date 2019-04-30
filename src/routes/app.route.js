import express from 'express';
import UserRouter from "./user/user.route";
import QuizRouter from "./quiz/quiz.route";
import ResultRouter from "./result/result.route";
import UserActionRouter from "./activity";
import {UserModel} from '../models'
import HttpUtil from "../utils/http.util";
import {Error} from "../errors/Error";
import QuestionRouter from "./question/question.route"
const AppRoute = express.Router();

AppRoute.use((req, res, next) => {
    if (req.user && req.user.sub){
        UserModel.getById(req.user.sub)
            .then(user => {
                if (user.status !== 'ACTIVATED') {
                    HttpUtil.makeErrorResponse(res, Error.ACCOUNT_DISABLED)
                } else {
                    next();
                }
            }).catch(err => {
                next(err)
            })
    } else {
        next()
    }
})

// gte route
AppRoute.use('/user', UserRouter);
AppRoute.use('/action', UserActionRouter);
AppRoute.use('/quiz', QuizRouter);
AppRoute.use('/result', ResultRouter);

AppRoute.use('/question',QuestionRouter);

export default AppRoute;