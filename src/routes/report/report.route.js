import express from 'express';
import { ReportModel,QuestionModel } from '../../models';
import HttpUtil from "../../utils/http.util";
import {Error} from "../../errors/Error";
import mongoose from "mongoose";

const ReportRouter = express.Router();
ReportRouter.post('/questions', (req, res) => {
    QuestionModel.createListQuestions(req.body.questions).then(result=>{
        console.log(result)
    })
})
ReportRouter.get('/list', (req, res) => {
    ReportModel.list(['results'])
        .then(result => {
            HttpUtil.makeJsonResponse(res, result)
        })
    
})
ReportRouter.get('/results', (req, res) => {
    ReportModel.getById(req.body.id,'results','results')
        .then(result => {
            HttpUtil.makeJsonResponse(res, result)
        })
       
})
ReportRouter.get('/summary', (req, res) => {
    ReportModel.getById(req.body.id,null,'summary')
        .then(result => {
            HttpUtil.makeJsonResponse(res, result)
        })
 
})
ReportRouter.get('/room', (req, res) => {
    ReportModel.getById(req.body.id,["roomID"],'roomID')
        .then(result => {
            HttpUtil.makeJsonResponse(res, result)
        })
})
ReportRouter.get('/', (req, res) => {
    ReportModel.getById(req.body.id,null)
        .then(result => {
            HttpUtil.makeJsonResponse(res, result)
        })
})
ReportRouter.put('/', (req, res) => {  
    ReportModel.getById(req.body.id,'Owner','Owner')
        .then(result => {
            if(result.id!=req.user.sub){
                return HttpUtil.makeErrorResponse(res, Error.WRONG_USER)
            }
            ReportModel.updateModel(req.body.id,req.body,req.user.sub)
            .then(result => HttpUtil.makeJsonResponse(res, result));

        })
})
ReportRouter.post('/',(req,res)=>{
    ReportModel.createModel(req.body,req.user.sub)
    .then(result => HttpUtil.makeJsonResponse(res, result));   
})

export default ReportRouter;