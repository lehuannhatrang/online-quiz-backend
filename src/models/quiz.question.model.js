import mongoose from 'mongoose';
import createSchema from "../schema/base.schema";
import { QuestionSchema } from "../schema/quiz.question.schema";
import { UserActionModel,QuizModel,QuestionModel } from "../models";
import diff from 'deep-diff';
const questionSchema = createSchema(QuestionSchema, false, 'question');
//function static
questionSchema.statics.getQuestionsByQuiz = async function (quizid) {
    let id =  new mongoose.mongo.ObjectId(quizid)
    let result = QuizModel.findOne({_id: id});
    result.populate("questions");
    result = await result.exec();
    return result ? result.toObject() : null;
}
questionSchema.statics.setQuestionsByIndex = async function(quiz,index, model, user) {
    let id=quiz.questions[index]
    const oldVersion = await this.findOne({_id: id}).exec();
    //Update
    model.updatedAt = new Date();
    model.updatedBy = user;
    await this.findByIdAndUpdate(id, model).exec();
    const result = await this.findById(id).exec();

    const oldValueToDiff = oldVersion.toObject();
    const newValueToDiff = result.toObject();

    delete oldValueToDiff.updatedAt;
    delete oldValueToDiff.updatedBy;
    delete oldValueToDiff.createdBy;

    delete newValueToDiff.updatedAt;
    delete newValueToDiff.updatedBy;
    delete newValueToDiff.createdBy;

    const differ = diff(JSON.parse(JSON.stringify(oldValueToDiff)), JSON.parse(JSON.stringify(newValueToDiff)));
    if (differ) {
        const action = {
            type: 'UPDATE',
            user,
            collectionName: this.collection.name,
            diff: differ,
        }
        UserActionModel.create(action);
    }
    return result ? result.toObject() : null;
}
questionSchema.statics.createListQuestions=  function (questions,user){
    let listid=[];
    questions.forEach(function(element) {
        // console.log(element)
        QuestionModel.createModel(element,user).then(result=>{
                listid.push(result._id);
                console.log(result)
            })
    })
    return listid;
}
export default mongoose.model('Question', questionSchema);