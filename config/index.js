/* eslint-disable no-undef */
module.exports = {
	api: {
		host: process.env.DB_HOST || "localhost",
		user: process.env.DB_USER || "root",
		pass: process.env.DB_PASS || "Dexter54.",
		db: "testapp",
		port: 5000,
	},
	jwt: {
		secret: process.env.JWT_SECRET || "changethistoanenvvariablelateron",
	},
};