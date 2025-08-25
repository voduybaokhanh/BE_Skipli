var AccessCode = require("../models/AccessCode");
var Employee = require("../models/Employee");
var { generateSixDigitCode } = require("../utils/code");
var { isNonEmptyString } = require("../utils/validators");
var { sendEmail } = require("../services/mailer");

/**
 * POST /loginEmail
 * body: { email }
 * Generates a 6-digit code, stores it against the email, and sends email.
 */
async function loginEmail(req, res, next) {
	try {
		var email = req.body && req.body.email;
		if (!isNonEmptyString(email)) {
			return res.status(400).json({ error: "email is required" });
		}
		var code = generateSixDigitCode();
		var expiresAt = new Date(Date.now() + 10 * 60 * 1000);
		await AccessCode.findOneAndUpdate(
			{ channel: "email", identifier: email.toLowerCase() },
			{ code: code, expiresAt: expiresAt, channel: "email", identifier: email.toLowerCase() },
			{ upsert: true, new: true, setDefaultsOnInsert: true }
		);
		await sendEmail(email, "Your access code", "Your access code is: " + code);
		return res.json({ accessCode: code });
	} catch (err) {
		next(err);
	}
}

/**
 * POST /validateAccessCode
 * body: { accessCode, email }
 */
async function validateAccessCode(req, res, next) {
	try {
		var accessCode = req.body && req.body.accessCode;
		var email = req.body && req.body.email;
		if (!isNonEmptyString(accessCode) || !isNonEmptyString(email)) {
			return res.status(400).json({ error: "accessCode and email are required" });
		}
		var record = await AccessCode.findOne({ channel: "email", identifier: email.toLowerCase() });
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
 * GET /getAllEmployees
 * query: { page?, limit?, search?, department? }
 * Returns paginated, optionally filtered and searched list of employees.
 */
async function getAllEmployees(req, res, next) {
    try {
        var pageRaw = req.query && req.query.page;
        var limitRaw = req.query && req.query.limit;
        var search = req.query && req.query.search;
        var department = req.query && req.query.department;

        var page = parseInt(pageRaw, 10);
        var limit = parseInt(limitRaw, 10);
        if (isNaN(page) || page < 1) {
            page = 1;
        }
        if (isNaN(limit) || limit < 1 || limit > 100) {
            limit = 10;
        }

        var filter = {};
        if (isNonEmptyString(department)) {
            filter.department = department.trim();
        }
        if (isNonEmptyString(search)) {
            var regex = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
            filter.$or = [{ name: regex }, { email: regex }];
        }

        var skip = (page - 1) * limit;
        var [items, total] = await Promise.all([
            Employee.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Employee.countDocuments(filter)
        ]);

        return res.json({ page: page, limit: limit, total: total, items: items });
    } catch (err) {
        next(err);
    }
}

/**
 * PUT /updateEmployee
 * body: { employeeId, name?, email?, department? }
 * Updates provided fields on an employee.
 */
async function updateEmployee(req, res, next) {
    try {
        var employeeId = req.body && req.body.employeeId;
        var name = req.body && req.body.name;
        var email = req.body && req.body.email;
        var department = req.body && req.body.department;

        if (!isNonEmptyString(employeeId)) {
            return res.status(400).json({ error: "employeeId is required" });
        }

        var update = {};
        if (isNonEmptyString(name)) {
            update.name = name.trim();
        }
        if (isNonEmptyString(email)) {
            update.email = email.toLowerCase().trim();
        }
        if (isNonEmptyString(department)) {
            update.department = department.trim();
        }

        if (Object.keys(update).length === 0) {
            return res.status(400).json({ error: "At least one field to update is required" });
        }

        var updated = await Employee.findByIdAndUpdate(employeeId, { $set: update }, { new: true, runValidators: true });
        if (!updated) {
            return res.status(404).json({ error: "Employee not found" });
        }
        return res.json({ success: true });
    } catch (err) {
        if (err && err.code === 11000) {
            return res.status(409).json({ error: "Email already exists" });
        }
        next(err);
    }
}

module.exports = { loginEmail, validateAccessCode, getAllEmployees, updateEmployee };


