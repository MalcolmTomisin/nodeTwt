
const { Tweet, User, Comment, Favourite } = require("../model");

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
				if (tweet) {
					if (req.user) {
						req.user.addTweet(tweet.id);
						res.send({ success: true, tweet });
					}
				}
			}).catch(e => next(e));
	},
	listTweets: (req, res, next) => {
		let limit = 20;
		let page = req.params.page;
		let offset = limit * (page - 1);
		Tweet.findAndCountAll({
			limit,
			offset,
			order: ["id"],
			include: [User, Comment, Favourite]
		})
			.then(tweets => {
				if (tweets) {
					let count = tweets.count;
					let pages = Math.ceil(count / limit);
					console.log(count / limit, pages);
					res.status(200).json({
						success: true,
						tweets: tweets.rows,
						count: count,
						pages: pages,
					});
				} else {
					res.send({ success: false, status: "No results" });
				}
			}).catch(next);
	}
};