import { Schema, model, Types } from 'mongoose';


const JobSchema = new Schema({
    employerId: { type: Types.ObjectId, ref: 'User', required: true },
    // company: { type: String, required: true, index: true },
    title: { type: String, required: true, index: true },
    description: { type: String, required: true },
    location: { type: String, index: true },
    type: { type: String, enum: ['Full-time','Part-time','Contract','Internship','Remote'], index: true },
    salaryMin: { type: Number, index: true },
    salaryMax: { type: Number, index: true },
    requiredSkills: { type: [String], index: true },
    requiredExperience: { type: Number, index: true }, // in years
    isRemote: { type: Boolean, index: true },
    status: { type: String, enum: ['active','paused','closed'], default: 'active', index: true },
}, { timestamps: true });


JobSchema.index({ title: 'text', description: 'text', requiredSkills: 'text' });


export default model('Job', JobSchema);