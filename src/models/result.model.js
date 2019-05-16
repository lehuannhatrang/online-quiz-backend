import mongoose from 'mongoose';
import createSchema from "../schema/base.schema";
import {ResultSchema} from "../schema/result.schema";

const resultSchema = createSchema(ResultSchema, false, 'results');

export default mongoose.model('Result', resultSchema);