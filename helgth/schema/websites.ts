import mongoose from "mongoose";

const websitesSchema = new mongoose.Schema({
    url: String,
    name: String,
    allow: Boolean,
    responseTime: Number,
    isHealthy: {
        type: Boolean,
        default: false,
    },
    lastCheck: {
        type: Date,
        default: Date.now
    }
});

export const Websites = mongoose.model('websites', websitesSchema);
