var express = require("express");
var router = express.Router();
const controllers = require("../controllers/tweet");
const { isLoggedIn } = require("../middleware");

router.post("/create",isLoggedIn, controllers.create);
router.get("/list/:page", isLoggedIn, controllers.listTweets);
router.post("/like", isLoggedIn, controllers.like);

module.exports = router;