import express from 'express';
import { UserModel, UserInfoModel,RoomModel } from '../../models';
import HttpUtil from "../../utils/http.util";
import {Error} from "../../errors/Error";
import mongoose from "mongoose";

const RoomRouter = express.Router();

RoomRouter.get('/list', (req, res) => {
    RoomModel.list(['quizID','Report'])
        .then(result => {
            HttpUtil.makeJsonResponse(res, result)
        })
    
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
    RoomModel.getById(req.body.id,'Owner','Owner')
        .then(result => {
            if(result.id!=req.user.sub){
                return HttpUtil.makeErrorResponse(res, Error.WRONG_USER)
            }
            RoomModel.updateModel(req.body.id,req.body,req.user.sub)
            .then(result => HttpUtil.makeJsonResponse(res, result));

        })

})
RoomRouter.post('/',async (req,res)=>{
    RoomModel.createModel(req.body,req.user.sub)
        .then(result => HttpUtil.makeJsonResponse(res, result));
})

export default RoomRouter;