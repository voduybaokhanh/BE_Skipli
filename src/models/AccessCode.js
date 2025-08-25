var mongoose = require("mongoose");

var AccessCodeSchema = new mongoose.Schema(
	{
		channel: { type: String, enum: ["phone", "email"], required: true },
		identifier: { type: String, required: true, index: true }, // phoneNumber or email
		code: { type: String, required: true },
		expiresAt: { type: Date, required: true }
	},
	{ timestamps: true }
);

AccessCodeSchema.index({ channel: 1, identifier: 1 }, { unique: true });

module.exports = mongoose.model("AccessCode", AccessCodeSchema);


