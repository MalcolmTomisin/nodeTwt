var express = require("express");
var router = express.Router();
const controller = require("../controllers");
/* GET users listing. */
router.get("/", function(req, res, next) {
	res.send("respond with a resource");
});

router.post("/login", controller.signIn);
router.post("/create", controller.newUser);
router.post("/verify", controller.verifyEmail);

module.exports = router;
