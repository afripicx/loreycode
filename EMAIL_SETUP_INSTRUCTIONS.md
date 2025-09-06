# Email Setup Instructions for LoreyCode Contact Form

## Overview
The contact form is now configured to send emails to `loreycode@gmail.com` when users submit the form. Two emails are sent:
1. **Notification email** to `loreycode@gmail.com` with the user's message
2. **Auto-reply email** to the user confirming receipt

## Gmail App Password Setup

To enable email functionality, you need to set up a Gmail App Password:

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings: https://myaccount.google.com/
2. Navigate to **Security** > **2-Step Verification**
3. Follow the steps to enable 2-Factor Authentication if not already enabled

### Step 2: Generate App Password
1. Go to **Security** > **2-Step Verification** > **App passwords**
2. Select **Mail** as the app
3. Select **Other (custom name)** as the device
4. Enter "LoreyCode Website" as the name
5. Click **Generate**
6. Copy the 16-character app password (e.g., `abcd efgh ijkl mnop`)

### Step 3: Update Environment Variable
Use the DevServerControl tool to set the real app password:

```bash
# Replace "your-gmail-app-password-here" with the actual 16-character app password
EMAIL_PASS=abcd-efgh-ijkl-mnop
```

Or in the Builder.io interface, update the EMAIL_PASS environment variable with your actual app password.

## Testing the Email Functionality

1. Go to the Contact page on your website
2. Fill out and submit the contact form
3. Check that you receive the notification email at `loreycode@gmail.com`
4. Check that the form submitter receives an auto-reply confirmation

## Current Configuration

- **SMTP Host**: smtp.gmail.com
- **SMTP Port**: 587
- **Email User**: loreycode@gmail.com
- **Recipient**: loreycode@gmail.com
- **From Name**: LoreyCode Contact Form

## Email Templates

### Notification Email (to LoreyCode)
- Contains all form details (name, email, phone, service, subject, message)
- Professional HTML formatting with LoreyCode branding
- Includes submission timestamp

### Auto-Reply Email (to Form Submitter)
- Thanks the user for contacting LoreyCode
- Confirms receipt of their message
- Includes contact information and service overview
- Professional HTML formatting

## Troubleshooting

### Common Issues:
1. **Authentication Error**: Make sure you're using an App Password, not your regular Gmail password
2. **"Less Secure Apps" Error**: App Passwords bypass this requirement
3. **Form Submits but No Email**: Check server logs for error messages

### Testing Email Configuration:
The email service includes a verification method that checks the SMTP connection. Server logs will show "Email service is ready to send emails" if configured correctly.

## Security Notes
- App passwords are safer than using your main Gmail password
- The EMAIL_PASS environment variable is stored securely and not committed to code
- All emails are sent via Gmail's secure SMTP servers
