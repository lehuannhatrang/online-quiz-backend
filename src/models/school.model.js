import mongoose from 'mongoose';
import createSchema from "../schema/base.schema";
import {SchoolSchema} from "../schema/school.schema";

const schoolSchema = createSchema(SchoolSchema, false, 'school');



export default mongoose.model('School', schoolSchema);