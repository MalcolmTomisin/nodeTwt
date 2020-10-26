
const mailer = require("nodemailer");
require("dotenv").config();

const transporter = mailer.createTransport({
	service: "gmail",
	auth: {
		// eslint-disable-next-line no-undef
		user: process.env.EMAIL_USER,
		// eslint-disable-next-line no-undef
		pass: process.env.EMAIL_PASS,
	},
});

module.exports = {
	validateEmail: (mail) => {
		if (
			/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
				mail
			)
		) {
			return true;
		}
		return false;
	},
	sendMail: (to, subject, text, callback) => {
		transporter.sendMail(
			{
				from: "malcolmtomisin@gmail.com",
				to: to,
				subject: subject,
				text: text,
				html: `<html><h3>${text}</h3></html>`,
			},
			(err, info) => {
				callback(err, null);
				console.log(info.envelope);
				console.log(info.messageId);
			}
		);
	},
	idToken: (length) => {
		//edit the token allowed characters
		var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split(
			""
		);
		var b = [];
		for (var i = 0; i < length; i++) {
			var j = (Math.random() * (a.length - 1)).toFixed(0);
			b[i] = a[j];
		}
		return b.join("");
	},
};