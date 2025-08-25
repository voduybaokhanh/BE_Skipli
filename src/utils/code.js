var crypto = require("crypto");

/** Generate a zero-padded 6-digit numeric code. */
function generateSixDigitCode() {
	var num = crypto.randomInt(0, 1000000);
	return String(num).padStart(6, "0");
}

module.exports = { generateSixDigitCode };


