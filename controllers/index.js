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
		let emailArr = email.split("");
		let BEGIN_CHARACTER = 0;
		let name = emailArr.slice(BEGIN_CHARACTER, emailArr.findIndex(char => char === "@")).join("");

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
								name
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
	},
	verifyEmail: (req, res, next) => {
		let { token, email } = req.body;
		if (!token)
			return res
				.status(200)
				.json({
					success: false,
					status: "Something went wrong, we could not find your token",
				});
		if (!email)
			return res
				.status(200)
				.json({
					success: false,
					status: "Something went wrong, we could not find your email",
				});

		User
			.findOne({ where: { email: email } })
			.then((user) => {
				if (!user)
					return res
						.status(200)
						.json({
							success: false,
							status: "A user with that email address doesn't exist",
						});
				if (user.emailVerificationToken === token) {
					User
						.update(
							{ emailVerified: true, emailVerificationToken: null },
							{ where: { email: email } }
						)
						.then((user) => {
							if (!user.length)
								return res
									.status(500)
									.json({
										success: false,
										status: "Could not update your record at this time",
									});
							return res.json({
								success: true,
								status: "Email verified successfully",
							});
						})
						.catch((err) => next(err));
				} else {
					return res
						.status(200)
						.json({
							success: false,
							status: "The email verification token is incorrect",
						});
				}
			})
			.catch((err) => next(err));
	},
	signIn: (req, res, next) => {
		const { email, password } = req.body;
		if (!email || !password) {
			return res
				.status(200)
				.json({
					success: false,
					status:
            "You have to provide both your username and password to sign in",
				});
		}
		sequelize.sync().then(() => {
			User.findOne({ where: { email: email } })
				.then(async data => {
					if (!data) {
						res
							.status(404)
							.json({
								success: false,
								status: "A user with this email does not exist",
							});
					} else {
						let user = data.get();
						console.log(user);
						let pass = bcrypt.compareSync(password, user.password);
						if (pass) {
							let token = await jwt.sign(
								{ id: user.id, email: user.email },
								config.jwt.secret
							);
							if (token) {
								return res.status(200).json({ user: clean(user), token });
							} else {
								return res.status(500).json({
									success: false,
									status: "Could not generate an auth token",
								});
							}
						} else {
							res
								.status(200)
								.send({
									success: false,
									status: "Incorrect email or password!",
								});
						}
					}
				}).catch(err => next(err));
		});
	}
};