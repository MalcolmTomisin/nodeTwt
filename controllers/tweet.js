
const { Tweet, User, Comment, Favourite } = require("../model");

module.exports = {
	create: (req, res, next) => {
		const { content } = req.body;
		if (!req.userId) {
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
	},
	like: (req, res, next) => {
		let { favourite, tweetId } = req.body;
		if (!tweetId) {
			res.send({ success: false, status: "Tweet Id not specified" });
		}
		Favourite.findOne({ where: { userId: req.userId, tweetId } })
			.then(result => {
				if (result) {
					Favourite.update({ like: favourite }, {
						where: {
							userId: req.userId
						}
					})
						.then(updatedRows => {
							if (updatedRows[0] > 0) {
								return res.send({ success: true });
							}
							return res.send({ success: false, status: "Error updating" });
						}).catch(next);
				} else {
					Favourite.create({ like: favourite, userId: req.userId, tweetId })
						.then(result => {
							if (result) {
								return res.send({ success: true });
							}
							return res.send({ success: false });
						}).catch(next);
				}
			}).catch(next);
	}
};