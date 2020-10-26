/* eslint-disable no-undef */
module.exports = {
	api: {
		host: process.env.DB_HOST || "localhost",
		user: process.env.DB_USER || "root",
		pass: process.env.DB_PASS || "Notheadsuppass2000",
		db: "test",
		port: 5000,
	},
	jwt: {
		secret: process.env.JWT_SECRET || "changethistoanenvvariablelateron",
	},
};