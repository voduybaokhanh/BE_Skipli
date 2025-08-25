var mongoose = require("mongoose");

var EmployeeSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true },
		email: { type: String, required: true, trim: true, lowercase: true, unique: true },
		department: { type: String, required: true, trim: true }
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Employee", EmployeeSchema);


