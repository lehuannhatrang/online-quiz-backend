import mongoose from 'mongoose';
import createSchema from "../schema/base.schema";
import {ReportSchema} from "../schema/report.schema";

const reportSchema = createSchema(ReportSchema, false, 'report');



export default mongoose.model('Report', reportSchema);