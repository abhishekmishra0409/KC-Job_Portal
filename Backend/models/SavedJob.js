import { Schema, model, Types } from 'mongoose';


const SavedJobSchema = new Schema({
    seekerId: { type: Types.ObjectId, ref: 'User', index: true },
    jobId: { type: Types.ObjectId, ref: 'Job', index: true },
}, { timestamps: true });


SavedJobSchema.index({ seekerId: 1, jobId: 1 }, { unique: true });


export default model('SavedJob', SavedJobSchema);