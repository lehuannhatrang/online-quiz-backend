import mongoose from 'mongoose';
import createSchema from "../schema/base.schema";
import {QuizSchema} from "../schema/quiz.schema";

const quizSchema = createSchema(QuizSchema, false, 'quizzes');



export default mongoose.model('Quiz', QuizSchema);