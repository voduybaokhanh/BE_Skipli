var AccessCode = require("../models/AccessCode");
var { isNonEmptyString } = require("../utils/validators");

/**
 * POST /validateAccessCode
 * body: { accessCode, email? , phoneNumber? }
 * Determines channel by provided identifier and validates.
 */
async function validateAccessCode(req, res, next) {
	try {
		var accessCode = req.body && req.body.accessCode;
		var email = req.body && req.body.email;
		var phoneNumber = req.body && req.body.phoneNumber;
		if (!isNonEmptyString(accessCode)) {
			return res.status(400).json({ error: "accessCode is required" });
		}
		var channel = null;
		var identifier = null;
		if (isNonEmptyString(email)) {
			channel = "email";
			identifier = email.toLowerCase();
		} else if (isNonEmptyString(phoneNumber)) {
			channel = "phone";
			identifier = phoneNumber;
		} else {
			return res.status(400).json({ error: "email or phoneNumber is required" });
		}
		var record = await AccessCode.findOne({ channel: channel, identifier: identifier });
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

module.exports = { validateAccessCode };


