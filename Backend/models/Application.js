import { Schema, model, Types } from 'mongoose';


const ApplicationSchema = new Schema({
    jobId: { type: Types.ObjectId, ref: 'Job', required: true, index: true },
    seekerId: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    resumeUrl: String,
    coverLetter: String,
    status: { type: String, enum: ['received','shortlisted','interview','offered','rejected'], default: 'received', index: true },
    notes: String,
}, { timestamps: true });


ApplicationSchema.index({ jobId: 1, seekerId: 1 }, { unique: true });


export default model('Application', ApplicationSchema);