"use strict";
//lib
const {DataTypes} = require("sequelize");
//instance or connection to db
const sequelize = require("../config/database.js");

const UserModel = (instance, dataType) => {
	return instance.define("user", {
		id: {
			type: dataType.INTEGER,
			primaryKey: true,
			allowNull: false,
			autoIncrement: true,
		},
		name: dataType.STRING,
		email: dataType.STRING,
		password: dataType.STRING,
		emailVerificationToken: dataType.STRING,
		emailVerified: {
			type: dataType.BOOLEAN,
			defaultValue: false,
		},
	});
};



const TweetModel = (instance, dataType) => {
	return instance.define("tweet", {
		id: {
			type: dataType.INTEGER,
			primaryKey: true,
			allowNull: false,
			autoIncrement: true
		},
		content: dataType.TEXT,
	});
};

const CommentModel = (instance, dataType) => {
	return instance.define("comment", {
		id: {
			type: dataType.INTEGER,
			primaryKey: true,
			allowNull: false,
			autoIncrement: true
		},
		content: dataType.TEXT,
	});
};

const FavouriteModel = (instance, dataType) => {
	return instance.define("favourite", {
		id: {
			type: dataType.INTEGER,
			primaryKey: true,
			allowNull: false,
			autoIncrement: true
		},
		number: dataType.INTEGER
	});
};


const User = UserModel(sequelize, DataTypes);
const Tweet = TweetModel(sequelize, DataTypes);
const Comment = CommentModel(sequelize, DataTypes);
const Favourite = FavouriteModel(sequelize, DataTypes);

//Associations

User.hasMany(Tweet);
Tweet.belongsTo(User);
Tweet.hasMany(Comment);
Comment.belongsTo(Tweet);
User.hasMany(Comment);
Comment.belongsTo(User);
Tweet.hasMany(Favourite);
Favourite.belongsTo(Tweet);
User.hasOne(Favourite);
Favourite.belongsTo(User);

sequelize.sync({ force: true }).then(() => {
  console.log("Database & tables created..");
});

module.exports = {
	User, Tweet, Comment, Favourite
};