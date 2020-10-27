const sequelize = require("../config/database");
const { Tweet } = require("../model");

module.exports = {
	create: (req, res, next) => {
		const { content, userId } = req.body;
		if (!userId) {
			return res.status(200).json({ success: false, status: "No user id specified" });
		}
		if (!content || content === "") {
			return res.status(200).json({ success: false, status: "Invalid content field" });
        }
        Tweet.create({ content })
            .then(async tweet => {
            
        })
	}
};