const noticeModel = require("../models/notice");

class Notice {
    async getAllNotices(req, res) {
        try {
            let notices = await noticeModel.find({}).sort({ _id: -1 });
            return res.json({ notices });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    async postAddNotice(req, res) {
        let { title, description, time } = req.body;

        if (!title || !description || !time) {
            return res.json({ error: "All fields must be required" });
        }

        try {
            let newNotice = new noticeModel({
                title,
                description,
                time: new Date(time), // Ensure it's stored as a Date object
            });

            await newNotice.save();
            return res.json({ success: "Notice created successfully" });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    async postEditNotice(req, res) {
        let { nId, title, description, time } = req.body;

        if (!nId || !title || !description || !time) {
            return res.json({ error: "All fields must be required" });
        }

        try {
            let editNotice = await noticeModel.findByIdAndUpdate(
                nId,
                { title, description, time: new Date(time), updatedAt: Date.now() },
                { new: true }
            );

            if (editNotice) {
                return res.json({ success: "Notice updated successfully" });
            } else {
                return res.json({ error: "Notice not found" });
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    async getDeleteNotice(req, res) {
        let { nId } = req.body;

        if (!nId) {
            return res.json({ error: "Notice ID is required" });
        }

        try {
            let deleteNotice = await noticeModel.findByIdAndDelete(nId);

            if (deleteNotice) {
                return res.json({ success: "Notice deleted successfully" });
            } else {
                return res.json({ error: "Notice not found" });
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
}

const noticeController = new Notice();
module.exports = noticeController;
