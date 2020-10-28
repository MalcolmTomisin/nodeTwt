var express = require("express");

var router = express.Router();

/* GET home page. */

router.get("/", function(req, res, next) {
	res.send({ index: "Welcome to nothing" });
	return next;
});


module.exports = router;