const bcrypt = require("bcrypt");
const sequelize = require("../config/database");
const jwt = require("jsonwebtoken");
const config = require("../config");
const { validateEmail, idToken, clean, sendMail } = require("../util");
const { User } = require("../model");

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
		const hashedPassword = bcrypt.hashSync(password, salt);
		formData.password = hashedPassword;

		User.count({ where: { email: email } })
			.then((user) => {
				if (!user) {
					let emailVerificationToken;
					sequelize
						.sync()
						.then(() => {
							emailVerificationToken = idToken(40);
							let userDetails = {
								...formData,
								emailVerificationToken,
							};
							return User.create(userDetails);
						})
						.then((user) => {
							user = user.get();
							res.status(200).json({
								success: true,
								user: clean(user),
							});
							console.log(user);
							sendMail(
								user.email,
								"Your Email Verification Token",
								`Hey there. Thank you for signing up. Click on this link or post the link in your browser to verify your email - https://bilbordapp.com?verify=true&email=${user.email}&token=${emailVerificationToken}`,
								(err, info) => {
									if (!err && info) {
										console.log(info);
										// return res.json({success : true, status : "An account verification token has been sent to your email"});
									} else {
										console.log(err);
										return next(
											new Error(
												`Could not send account verification token to user - ${JSON.stringify(
													user
												)}`
											)
										);
									}
								}
							);
						});
				} else {
					res.status(200).json({
						success: false,
						status: "A user with the provided email address already exists",
					});
				}
			})
			.catch((err) => next(err));
	}
};