import express from 'express';
import { UserModel, UserInfoModel } from '../models';
import HttpUtil from '../utils/http.util';
import {Error} from '../errors/Error';
import mongoose from 'mongoose';

const SignUpRoute = express.Router();

SignUpRoute.post('/', (req, res) => {
    if(!req.body.username || ! req.body.password || !req.body.role || !req.body.email)  HttpUtil.makeErrorResponse(res, Error.BAD_REQUEST);

    const user = UserModel.getUserByUsername(req.body.username)
    user.then(result => {
        if(result)  HttpUtil.makeErrorResponse(res, Error.DUPLICATE_USERNAME);
        else {
            const userInfo = UserInfoModel.getUserInfoByMail(req.body.email);
            userInfo.then(info => {
                if(info)    HttpUtil.makeErrorResponse(res, Error.DUPLICATED_USER_INFO);
                else {
                    const createUser = {
                        user: req.body.username,
                        password: req.body.password,
                        status: 'PENDING',
                    };
                    UserModel.createModel(createUser)
                        .then(user => {
                            const createUserInfo = {
                                phone: req.body.phone,
                                mail: req.body.email,
                                role: req.body.role,
                                displayName: req.body.displayName,
                                user: user,
                            };
                            UserInfoModel.createModel(createUserInfo, user)
                                .then(result => HttpUtil.makeJsonResponse(res, user))
                        });
                }
            })
        };
    });
})

export default SignUpRoute;