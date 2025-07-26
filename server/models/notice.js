const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        time: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const noticeModel = mongoose.model("notices", noticeSchema);
module.exports = noticeModel;
