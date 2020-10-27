var express = require("express");
var router = express.Router();
const controller = require("../controllers/comment");
const { isLoggedIn } = require("../middleware");

router.post("/create", isLoggedIn, controller.create);
router.get("/list", isLoggedIn, controller.list);

module.exports = router;

