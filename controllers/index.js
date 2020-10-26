const bcrypt = require("bcrypt");
const sequelize = require("../config/database");
const jwt = require("jsonwebtoken");
const config = require("../config");
const { validateEmail } = require("../util");

module.exports = {
	newUser: (req, res, next) => {
		const formData = req.body;
		let email = formData.email;
		let password = formData.password;
		if (!validateEmail(email)) return res.status(200).json({
			success: false,
			status: "You have to provide valid email address"
		});
		if (!password) return res.status(200).json({
			success: false,
			status: "You have to provide a password"
		});
		const salt = bcrypt.genSaltSync(10);
		if (!salt) {
			next(new Error("Could not generate a salt"));
		}
	}
};