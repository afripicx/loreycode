import nodemailer from 'nodemailer';
import { ContactFormData } from '@shared/api';

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    const config: EmailConfig = {
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASS || '',
      },
    };

    this.transporter = nodemailer.createTransport(config);
  }

  async sendContactFormEmail(formData: ContactFormData): Promise<void> {
    const recipient = process.env.EMAIL_RECIPIENT || 'loreycode@gmail.com';
    const fromName = process.env.EMAIL_FROM_NAME || 'LoreyCode Contact Form';

    // Email to LoreyCode (notification about new contact form submission)
    const notificationMailOptions = {
      from: `"${fromName}" <${process.env.EMAIL_USER}>`,
      to: recipient,
      subject: `New Contact Form Submission: ${formData.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">New Contact Form Submission</h1>
          </div>
          
          <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            <div style="margin-bottom: 20px;">
              <h2 style="color: #1e40af; margin: 0 0 10px 0; font-size: 18px;">Contact Details</h2>
              <p style="margin: 5px 0;"><strong>Name:</strong> ${formData.name}</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> ${formData.email}</p>
              ${formData.phone ? `<p style="margin: 5px 0;"><strong>Phone:</strong> ${formData.phone}</p>` : ''}
              ${formData.service ? `<p style="margin: 5px 0;"><strong>Service Interest:</strong> ${formData.service}</p>` : ''}
            </div>
            
            <div style="margin-bottom: 20px;">
              <h2 style="color: #1e40af; margin: 0 0 10px 0; font-size: 18px;">Subject</h2>
              <p style="margin: 0; font-weight: 600;">${formData.subject}</p>
            </div>
            
            <div>
              <h2 style="color: #1e40af; margin: 0 0 10px 0; font-size: 18px;">Message</h2>
              <div style="background: #f9fafb; padding: 15px; border-radius: 6px; border-left: 4px solid #3b82f6;">
                <p style="margin: 0; line-height: 1.6; white-space: pre-line;">${formData.message}</p>
              </div>
            </div>
            
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
              <p style="margin: 0;">This message was sent from the LoreyCode website contact form on ${new Date().toLocaleString()}.</p>
            </div>
          </div>
        </div>
      `,
      text: `
New Contact Form Submission

Contact Details:
Name: ${formData.name}
Email: ${formData.email}
${formData.phone ? `Phone: ${formData.phone}` : ''}
${formData.service ? `Service Interest: ${formData.service}` : ''}

Subject: ${formData.subject}

Message:
${formData.message}

Submitted on: ${new Date().toLocaleString()}
      `.trim(),
    };

    // Auto-reply email to the person who submitted the form
    const autoReplyMailOptions = {
      from: `"${fromName}" <${process.env.EMAIL_USER}>`,
      to: formData.email,
      subject: `Thank you for contacting LoreyCode - We'll be in touch soon!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">Thank You for Contacting LoreyCode!</h1>
          </div>
          
          <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Hi <strong>${formData.name}</strong>,
            </p>
            
            <p style="line-height: 1.6; margin-bottom: 20px;">
              Thank you for reaching out to us! We've received your message about "<strong>${formData.subject}</strong>" 
              and one of our team members will get back to you within 24 hours.
            </p>
            
            <div style="background: #f0f9ff; padding: 15px; border-radius: 6px; border-left: 4px solid #3b82f6; margin-bottom: 20px;">
              <h3 style="margin: 0 0 10px 0; color: #1e40af;">Your Message Summary:</h3>
              <p style="margin: 0; font-style: italic;">"${formData.message.substring(0, 150)}${formData.message.length > 150 ? '...' : ''}"</p>
            </div>
            
            <p style="line-height: 1.6; margin-bottom: 20px;">
              In the meantime, feel free to explore our website to learn more about our services:
            </p>
            
            <ul style="line-height: 1.8; margin-bottom: 20px;">
              <li><strong>ICT Training Courses:</strong> Professional development programs</li>
              <li><strong>Web Development:</strong> Custom websites and applications</li>
              <li><strong>Mobile Apps:</strong> iOS and Android development</li>
              <li><strong>Consulting:</strong> Technology advisory services</li>
            </ul>
            
            <div style="margin-top: 20px; padding: 15px; background: #f9fafb; border-radius: 6px;">
              <h3 style="margin: 0 0 10px 0; color: #1e40af;">Contact Information:</h3>
              <p style="margin: 5px 0;"><strong>Phone:</strong> 0748261019 | 0705660783</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> loreycode@gmail.com</p>
            </div>
            
            <p style="line-height: 1.6; margin-top: 20px;">
              Best regards,<br>
              <strong>The LoreyCode Team</strong>
            </p>
            
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
              <p style="margin: 0;">This is an automated response. Please do not reply to this email.</p>
            </div>
          </div>
        </div>
      `,
      text: `
Hi ${formData.name},

Thank you for reaching out to us! We've received your message about "${formData.subject}" and one of our team members will get back to you within 24 hours.

Your Message Summary:
"${formData.message.substring(0, 150)}${formData.message.length > 150 ? '...' : ''}"

In the meantime, feel free to explore our website to learn more about our services:
- ICT Training Courses: Professional development programs
- Web Development: Custom websites and applications
- Mobile Apps: iOS and Android development
- Consulting: Technology advisory services

Contact Information:
Phone: 0748261019 | 0705660783
Email: loreycode@gmail.com

Best regards,
The LoreyCode Team

This is an automated response. Please do not reply to this email.
      `.trim(),
    };

    try {
      // Send notification email to LoreyCode
      await this.transporter.sendMail(notificationMailOptions);
      
      // Send auto-reply to the form submitter
      await this.transporter.sendMail(autoReplyMailOptions);
      
      console.log('Contact form emails sent successfully');
    } catch (error) {
      console.error('Error sending contact form emails:', error);
      throw new Error('Failed to send email notifications');
    }
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('Email service is ready to send emails');
      return true;
    } catch (error) {
      console.error('Email service verification failed:', error);
      return false;
    }
  }
}

// Create a singleton instance
export const emailService = new EmailService();
