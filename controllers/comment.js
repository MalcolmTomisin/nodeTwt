const { User, Comment } = require("../model");


module.exports = {
	create: (req, res, next) => {
		const { tweetId, comment, user } = req.body;
		
		Comment.create({ comment, tweetId, userId: user.id })
			.then(post => {
				if (post) {	
					res.send({ success: true, comment: post });
				}
			}).catch(next);
		
	},
	list: (req, res, next) => {
		const { tweetId } = req.body;

		Comment.findAll({ where: { tweetId }, include: [User] })
			.then(result => {
				if (result) {
					res.send({ success: true, comments: result });
				}
			})
			.catch(next);
	}
};