const jwt = require("jsonwebtoken");
const config = require("../config");
const { User } = require("../model");

module.exports = {
	isLoggedIn: (req, res, next) => {
		let { token } = req.headers;
		if (!token) {
			return res
				.status(403)
				.json({ error: "You do not have authorization to do that." });
		}
		jwt.verify(token, config.jwt.secret, async (err, decodedToken) => {
			if (err)
				return res
					.status(403)
					.json({ error: "Invalid or malformed token" });
			if (!decodedToken)
				return res.status(403).json({ error: "Not authorized" });

			req.userEmail = decodedToken.email;
			req.userId = decodedToken.id;

			return AddUserToReqObject(req, res, next);
		});
	}
};

const AddUserToReqObject = (request, response, next) => {
	User
		.findOne({ where: { id: request.userId } })
		.then((user) => {
			if (!user) {
				return response.json({ success: false, status: "User not found" });
			}
			request["user"] = user;
			return next();
		})
		.catch((e) => next(e));
};