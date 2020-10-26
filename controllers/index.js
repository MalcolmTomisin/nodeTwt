const bcrypt = require("bcrypt");
const sequelize = require("../config/database");
const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = {
	newUser: (req, res, next) => {
		const formData = req.body;
		let email = formData.email;
		let password = formData.password;
		if (!email) return res.status(200).json({ success: false, status: "You have to provide your email address" });
		if (!password) return res.status(200).json({ success: false, status: "You have to provide a password" });
	}
}