var AccessCode = require("../models/AccessCode");
var Employee = require("../models/Employee");
var { generateSixDigitCode } = require("../utils/code");
var { isNonEmptyString } = require("../utils/validators");

/**
 * POST /createNewAccessCode
 * body: { phoneNumber }
 * Generates a 6-digit code tied to phoneNumber and stores it.
 */
async function createNewAccessCode(req, res, next) {
	try {
		var phoneNumber = req.body && req.body.phoneNumber;
		if (!isNonEmptyString(phoneNumber)) {
			return res.status(400).json({ error: "phoneNumber is required" });
		}
		var code = generateSixDigitCode();
		var expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
		await AccessCode.findOneAndUpdate(
			{ channel: "phone", identifier: phoneNumber },
			{ code: code, expiresAt: expiresAt, channel: "phone", identifier: phoneNumber },
			{ upsert: true, new: true, setDefaultsOnInsert: true }
		);
		return res.json({ accessCode: code });
	} catch (err) {
		next(err);
	}
}

/**
 * POST /validateAccessCode
 * body: { accessCode, phoneNumber }
 */
async function validateAccessCode(req, res, next) {
	try {
		var accessCode = req.body && req.body.accessCode;
		var phoneNumber = req.body && req.body.phoneNumber;
		if (!isNonEmptyString(accessCode) || !isNonEmptyString(phoneNumber)) {
			return res.status(400).json({ error: "accessCode and phoneNumber are required" });
		}
		var record = await AccessCode.findOne({ channel: "phone", identifier: phoneNumber });
		if (!record || record.code !== accessCode) {
			return res.status(401).json({ success: false, error: "Invalid code" });
		}
		if (record.expiresAt < new Date()) {
			return res.status(401).json({ success: false, error: "Code expired" });
		}
		record.code = "";
		await record.save();
		return res.json({ success: true });
	} catch (err) {
		next(err);
	}
}

/**
 * POST /getEmployee
 * body: { employeeId }
 */
async function getEmployee(req, res, next) {
	try {
		var employeeId = req.body && req.body.employeeId;
		if (!isNonEmptyString(employeeId)) {
			return res.status(400).json({ error: "employeeId is required" });
		}
		var employee = await Employee.findById(employeeId).lean();
		if (!employee) {
			return res.status(404).json({ error: "Employee not found" });
		}
		return res.json(employee);
	} catch (err) {
		next(err);
	}
}

/**
 * POST /createEmployee
 * body: { name, email, department }
 */
async function createEmployee(req, res, next) {
	try {
		var name = req.body && req.body.name;
		var email = req.body && req.body.email;
		var department = req.body && req.body.department;
		if (!isNonEmptyString(name) || !isNonEmptyString(email) || !isNonEmptyString(department)) {
			return res.status(400).json({ error: "name, email, department are required" });
		}
		var employee = await Employee.create({ name: name, email: email, department: department });
		return res.status(201).json({ success: true, employeeId: String(employee._id) });
	} catch (err) {
		// Handle duplicate email gracefully
		if (err && err.code === 11000) {
			return res.status(409).json({ error: "Email already exists" });
		}
		next(err);
	}
}

/**
 * POST /deleteEmployee
 * body: { employeeId }
 */
async function deleteEmployee(req, res, next) {
	try {
		var employeeId = req.body && req.body.employeeId;
		if (!isNonEmptyString(employeeId)) {
			return res.status(400).json({ error: "employeeId is required" });
		}
		var result = await Employee.findByIdAndDelete(employeeId);
		if (!result) {
			return res.status(404).json({ error: "Employee not found" });
		}
		return res.json({ success: true });
	} catch (err) {
		next(err);
	}
}

module.exports = {
	createNewAccessCode,
	validateAccessCode,
	getEmployee,
	createEmployee,
	deleteEmployee
};


