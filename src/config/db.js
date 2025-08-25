var mongoose = require("mongoose");

/**
 * Establish a connection to MongoDB using Mongoose.
 */
module.exports = function connectDb() {
	var uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/skipli";
	mongoose.set("strictQuery", true);
	mongoose
		.connect(uri, {
			serverSelectionTimeoutMS: 5000
		})
		.then(function() {
			console.log("MongoDB connected");
		})
		.catch(function(err) {
			console.error("MongoDB connection error:", err.message);
			process.exit(1);
		});
};


