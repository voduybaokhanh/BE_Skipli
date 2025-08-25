/**
 * Simple mailer facade. In production, integrate nodemailer or an ESP.
 * This version logs to console and can be swapped later.
 */
async function sendEmail(to, subject, body) {
	console.log("[EMAIL] to=", to, "subject=", subject, "body=", body);
}

module.exports = { sendEmail };


