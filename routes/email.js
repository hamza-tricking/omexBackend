const express = require('express');
const router = express.Router();
const emailService = require('../services/emailService');

// Send order confirmation email
router.post('/send-order-confirmation', async (req, res) => {
    try {
        const { orderData, customerEmail } = req.body;

        if (!orderData || !customerEmail) {
            return res.status(400).json({ 
                message: 'Order data and customer email are required' 
            });
        }

        const result = await emailService.sendOrderConfirmation(orderData, customerEmail);
        
        if (result.success) {
            res.json({ 
                message: 'Order confirmation email sent successfully',
                messageId: result.messageId 
            });
        } else {
            res.status(500).json({ 
                message: 'Failed to send email',
                error: result.error 
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Send incomplete order notification
router.post('/send-incomplete-notification', async (req, res) => {
    try {
        const { orderData } = req.body;

        if (!orderData) {
            return res.status(400).json({ 
                message: 'Order data is required' 
            });
        }

        const result = await emailService.sendIncompleteOrderNotification(orderData);
        
        if (result.success) {
            res.json({ 
                message: 'Incomplete order notification sent successfully',
                messageId: result.messageId 
            });
        } else {
            res.status(500).json({ 
                message: 'Failed to send notification',
                error: result.error 
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Send contact form email
router.post('/send-contact-form', async (req, res) => {
    try {
        const { name, email, phone, subject, message, formType = 'contact' } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ 
                message: 'Name, email, and message are required' 
            });
        }

        // Create HTML email template
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
                    <h1 style="margin: 0; font-size: 28px;">📧 New Contact Form Submission!</h1>
                    <p style="margin: 10px 0; font-size: 16px;">Someone has contacted you through your website</p>
                </div>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
                    <h2 style="color: #333; margin-top: 0;">Contact Information</h2>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
                        <div>
                            <p><strong>Name:</strong> ${name}</p>
                            <p><strong>Email:</strong> ${email}</p>
                            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
                        </div>
                        <div>
                            <p><strong>Subject:</strong> ${subject || 'General Inquiry'}</p>
                            <p><strong>Form Type:</strong> ${formType}</p>
                            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
                        </div>
                    </div>
                    
                    <div style="background: #e9ecef; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #495057; margin-top: 0;">Message</h3>
                        <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 30px; padding: 20px; background: #d4edda; border-radius: 10px;">
                    <p style="margin: 0; color: #155724;">📩 Please respond to this inquiry as soon as possible!</p>
                </div>
            </div>
        `;

        // Send to admin
        const result = await emailService.sendEmail({
            to: process.env.ADMIN_EMAIL || 'admin@omexuae.com',
            subject: `Contact Form: ${subject || 'New Message from ' + name}`,
            html: htmlContent,
            text: `Contact Form Submission\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\nSubject: ${subject || 'General Inquiry'}\n\nMessage:\n${message}`
        });
        
        if (result.success) {
            res.json({ 
                message: 'Contact form submitted successfully',
                messageId: result.messageId 
            });
        } else {
            res.status(500).json({ 
                message: 'Failed to send contact form',
                error: result.error 
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Simple send email endpoint - receives any text content
router.post('/send', async (req, res) => {
    try {
        const { to, subject, content } = req.body;

        if (!to || !subject || !content) {
            return res.status(400).json({ 
                message: 'To, subject, and content are required' 
            });
        }

        const result = await emailService.sendEmail({
            to,
            subject,
            html: `<div style="font-family: Arial, sans-serif; padding: 20px;">
                    <p style="white-space: pre-wrap; line-height: 1.6;">${content}</p>
                   </div>`,
            text: content
        });
        
        if (result.success) {
            res.json({ 
                message: 'Email sent successfully',
                messageId: result.messageId 
            });
        } else {
            res.status(500).json({ 
                message: 'Failed to send email',
                error: result.error 
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Test email endpoint
router.post('/test', async (req, res) => {
    try {
        const { to, subject, message } = req.body;

        if (!to || !subject || !message) {
            return res.status(400).json({ 
                message: 'To, subject, and message are required' 
            });
        }

        const result = await emailService.sendEmail({
            to,
            subject,
            html: `<p>${message}</p>`,
            text: message
        });
        
        if (result.success) {
            res.json({ 
                message: 'Test email sent successfully',
                messageId: result.messageId 
            });
        } else {
            res.status(500).json({ 
                message: 'Failed to send test email',
                error: result.error 
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
