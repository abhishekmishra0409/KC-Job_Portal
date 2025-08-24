import { Schema, model } from 'mongoose';


const EducationSchema = new Schema({
    degree: String,
    institution: String,
    startDate: Date,
    endDate: Date,
});


const ExperienceSchema = new Schema({
    title: String,
    company: String,
    startDate: Date,
    endDate: Date,
    description: String,
});


const UserSchema = new Schema({
    role: { type: String, enum: ['seeker', 'employer', 'admin'], required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    phone: String,
    passwordHash: { type: String },
    googleId: String,
// Job Seeker fields
    skills: { type: [String], index: true },
    education: [EducationSchema],
    experience: [ExperienceSchema],
    resumeUrl: String,
    location: {
        city: String,
        country: String,
        geo: { type: { type: String, enum: ['Point'], default: 'Point' }, coordinates: { type: [Number], default: [0,0] } },
    },
// Employer fields
    company: {
        name: String,
        website: String,
        logoUrl: String,
        about: String,
        location: String,
    },
    status: { type: String, enum: ['active', 'banned'], default: 'active' },
    isVerified: {
        type: Boolean,
        default: false,
    },
    otp: {
        type: String,
    },
    otpExpires: {
        type: Date,
    },
    otpLastSent: {
        type: Date,
        default: null,
    },
}, { timestamps: true });


UserSchema.index({ 'location.geo': '2dsphere' });


export default model('User', UserSchema);