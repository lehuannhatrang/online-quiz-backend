import mongoose from 'mongoose';
import createSchema from "../schema/base.schema";
import {QuizzSchema} from "../schema/quizz.schema";



export default mongoose.model('Quizz', QuizzSchema);