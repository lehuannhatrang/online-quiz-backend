import mongoose from 'mongoose';
import createSchema from "../schema/base.schema";
import { RoomSchema } from "../schema/room.schema";
const roomSchema = createSchema(RoomSchema, false, 'room');
export default mongoose.model('Room', roomSchema);