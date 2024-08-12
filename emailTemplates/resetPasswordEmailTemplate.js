// emailTemplates.js
const generateResetPasswordEmail = (user, resetUrl) => 
`<p>Dear <strong>${user.name},</strong></p>
<p>We have received a request to reset your password. If you did not make this request, please ignore this email.</p>
<p>To reset your password, please click the link below:</p>
<p><a href="${resetUrl}">Reset Your Password</a></p>
<p>if link is not working, click in below URL</p>
<p>URL: <a href="${resetUrl}">${resetUrl}</a></p>
<p>For your security, this link will expire in 1 hour. If the link has expired, you will need to request a new password reset.</p>
<p>If you need any assistance, please contact our support team at donotreply.dailytracker@gmail.com </p>
<p>This email was sent to you because you requested a password reset. Please do not reply to this email.</p>
<p>Thank you,<br>The Daily Tracker Team</p>
<hr>
`;

module.exports = { generateResetPasswordEmail };
