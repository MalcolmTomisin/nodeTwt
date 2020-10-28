const { User, Comment } = require("../model");


module.exports = {
	create: (req, res, next) => {
		const { tweetId, content } = req.body;
		console.log(req.body, "content");
		if (!content || content === "") {
			return res.send({ success: false, status: "invalid content field" });
		}
		
		Comment.create({ content, tweetId, userId: req.userId })
			.then(post => {
				if (post) {	
					return res.send({ success: true, comment: post });
				}
				else {
					return res.send({ success: false, status: "unable to create" });
				}
			}).catch(next);
		
	},
	list: (req, res, next) => {
		let tweetId = req.params.id;

		Comment.findAll({ where: { tweetId }, include: [User] })
			.then(result => {
				if (result) {
					return res.send({ success: true, comments: result });
				} else {
					return res.send({ success: false, status: "no comments" });
				}
			})
			.catch(next);
	}
};