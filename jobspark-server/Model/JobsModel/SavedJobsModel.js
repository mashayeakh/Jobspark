const { Schema, default: mongoose } = require("mongoose");

const savedJobsSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    jobId: {
        type: Schema.Types.ObjectId,
        ref: 'ActiveJob',
        required: true,
    },
    savedAt: {
        type: Date,
        default: Date.now(),
    },
},
    {
        timestamps: true,
    }
)

//prevent duplicate saves by smae user for the same job
savedJobsSchema.index({ userId: 1, jobId: 1 }, { unique: true });

module.exports = mongoose.model("SavedJob", savedJobsSchema);