// emailTemplates.js
const otpEmailTemplate = (otp) => 
    `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>OTP Verification</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f5f5f5;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
          font-size: 24px;
          color: #333333;
          margin-bottom: 20px;
        }
        p {
          font-size: 16px;
          color: #666666;
          margin-bottom: 20px;
        }
        .otp-code {
          font-size: 24px;
          font-weight: bold;
          color: #333333;
          display: inline-block;
          padding: 10px 20px;
          background-color: #f0f0f0;
          border: 1px solid #dddddd;
          border-radius: 4px;
        }
        .footer {
          font-size: 14px;
          color: #999999;
          text-align: center;
          margin-top: 20px;
        }
        .footer a {
          color: #007bff;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>OTP Verification Code</h1>
        <p>Dear User,</p>
        <p>We have received a request to verify your email address. Please use the following OTP code to complete the verification process:</p>
        <p class="otp-code">${otp}</p>
        <p>This OTP code is valid for the next 10 minutes. If you did not request this code, please ignore this email.</p>
        <p>Thank you for using our service!</p>
        <div class="footer">
          <p>For any assistance, please contact us at <a href="mailto:noreply.dailytracker@gmail.com">noreply.dailytracker@gmail.com</a>.</p>
        </div>
      </div>
    </body>
    </html>
`

module.exports = { otpEmailTemplate };
