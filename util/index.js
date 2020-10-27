
const mailer = require("nodemailer");
require("dotenv").config();

let transporter = mailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 25,
  auth: {
    user: "8c66f7b5ec1f52",
    pass: "a976ae22675cc5",
  },
  tls: {
    ciphers: "SSLv3",
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
	sendMail: async (to, subject, text, callback) => {
		transporter.sendMail(
			{
				from: "'Fred Foo 👻' <foo@example.com>",
				to: to,
				subject: subject,
				text: text,
				html: `<html><h3>${text}</h3></html>`,
			},
			(error, info) => {
				if (error) {
					return console.log(error);
				}
				console.log("Email sent: " + info.response);
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
	clean: (data) => {
		let sensitiveDetails = [
			"password",
			"emailVerified",
			"emailVerificationToken",
			"passwordRecoveryToken",
		];
		if (typeof data == "object") {
			for (let key in data) {
				if (sensitiveDetails.includes(key)) {
					delete data[key];
				}
			}
			return data;
		}
	},
};