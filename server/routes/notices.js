const express = require("express");
const router = express.Router();
const noticeController = require("../controller/notices");
const { loginCheck } = require("../middleware/auth");

router.get("/all-notices", noticeController.getAllNotices);
router.post("/add-notice", noticeController.postAddNotice);
router.post("/edit-notice", noticeController.postEditNotice);
router.post("/delete-notice", noticeController.getDeleteNotice);

module.exports = router;
