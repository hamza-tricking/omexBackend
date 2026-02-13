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
