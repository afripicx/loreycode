import { RequestHandler } from "express";
import { z } from "zod";
import { emailService } from "../services/emailService";

// Contact form validation schema
const ContactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  service: z.string().optional(),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const handleContactForm: RequestHandler = async (req, res) => {
  try {
    // Validate the request body
    const validatedData = ContactFormSchema.parse(req.body);

    console.log("Processing contact form submission:", {
      name: validatedData.name,
      email: validatedData.email,
      subject: validatedData.subject
    });

    try {
      // Send email notifications
      await emailService.sendContactFormEmail(validatedData);

      res.json({
        success: true,
        message: "Thank you for your message! We've sent you a confirmation email and will get back to you within 24 hours.",
        data: {
          name: validatedData.name,
          email: validatedData.email,
          submittedAt: new Date().toISOString(),
        }
      });

    } catch (emailError) {
      console.error("Email sending failed:", emailError);

      // Still return success to user but log the email failure
      res.json({
        success: true,
        message: "Thank you for your message! We've received it and will get back to you within 24 hours.",
        data: {
          name: validatedData.name,
          email: validatedData.email,
          submittedAt: new Date().toISOString(),
        }
      });
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      // Validation error
      res.status(400).json({
        success: false,
        message: "Please check your input and try again.",
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    } else {
      // Server error
      console.error("Contact form error:", error);
      res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later."
      });
    }
  }
};
