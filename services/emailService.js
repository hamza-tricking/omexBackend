const nodemailer = require('nodemailer');

// Create transporter with SMTP configuration
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // false for 587, true for 465
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    debug: true, // Enable debug logging
    connectionTimeout: 30000, // 30 seconds timeout
    greetingTimeout: 15000, // 15 seconds greeting timeout
    socketTimeout: 20000, // 20 seconds socket timeout
    tls: {
        rejectUnauthorized: false
    }
});

// Send email function
const sendEmail = async (options) => {
    try {
        console.log('📧 Email Service Debug:');
        console.log('- To:', options.to);
        console.log('- Subject:', options.subject);
        console.log('- From:', process.env.EMAIL_USER);
        console.log('- SMTP Host:', process.env.SMTP_HOST);
        console.log('- SMTP Port:', process.env.SMTP_PORT);
        
        const mailOptions = {
            from: `"${process.env.FROM_NAME || 'Omex UAE'}" <${process.env.EMAIL_USER}>`,
            to: options.to,
            subject: options.subject,
            html: options.html,
            text: options.text,
            priority: 'high' // Set high priority for better delivery
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully. Message ID:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Email Error Details:');
        console.error('- Error Code:', error.code);
        console.error('- Error Message:', error.message);
        console.error('- Full Error:', error);
        return { success: false, error: error.message };
    }
};

// Send order confirmation email
const sendOrderConfirmation = async (orderData, customerEmail) => {
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
                <h1 style="margin: 0; font-size: 28px;">🎉 Order Confirmation!</h1>
                <p style="margin: 10px 0; font-size: 16px;">Thank you for your order, ${orderData.nameClient}!</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h2 style="color: #333; margin-top: 0;">Order Details</h2>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
                    <div>
                        <p><strong>Customer Name:</strong> ${orderData.nameClient}</p>
                        <p><strong>Phone:</strong> ${orderData.phone || 'Not provided'}</p>
                        <p><strong>Product:</strong> ${orderData.nameOfProduct}</p>
                        <p><strong>Color:</strong> ${orderData.color}</p>
                    </div>
                    <div>
                        <p><strong>Quantity:</strong> ${orderData.quantity}</p>
                        <p><strong>Price:</strong> ${orderData.priceOfProduct} AED</p>
                        <p><strong>Total:</strong> ${orderData.priceOfProduct * orderData.quantity} AED</p>
                        <p><strong>Status:</strong> <span style="color: #28a745;">${orderData.status}</span></p>
                    </div>
                </div>
                
                ${orderData.address ? `
                <div style="background: #e9ecef; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #495057; margin-top: 0;">Shipping Information</h3>
                    <p><strong>Address:</strong> ${orderData.address}</p>
                    <p><strong>City:</strong> ${orderData.city}</p>
                </div>
                ` : ''}
                
                ${orderData.notes ? `
                <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #856404; margin-top: 0;">Notes</h3>
                    <p>${orderData.notes}</p>
                </div>
                ` : ''}
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 10px;">
                <p style="margin: 0; color: #6c757d;">We'll process your order within 24 hours.</p>
                <p style="margin: 10px 0 0; color: #6c757d;">For any questions, contact us at support@omexuae.com</p>
            </div>
        </div>
    `;

    return await sendEmail({
        to: customerEmail,
        subject: `Order Confirmation - ${orderData.nameOfProduct}`,
        html: htmlContent,
        text: `Order Confirmation\n\nCustomer: ${orderData.nameClient}\nProduct: ${orderData.nameOfProduct}\nPrice: ${orderData.priceOfProduct} AED\nQuantity: ${orderData.quantity}`
    });
};

// Send incomplete order notification
const sendIncompleteOrderNotification = async (orderData) => {
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
                <h1 style="margin: 0; font-size: 28px;">📋 Incomplete Order Alert!</h1>
                <p style="margin: 10px 0; font-size: 16px;">Customer started an order but didn't complete it.</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h2 style="color: #333; margin-top: 0;">Incomplete Order Details</h2>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
                    <div>
                        <p><strong>Customer Name:</strong> ${orderData.nameClient}</p>
                        <p><strong>Phone:</strong> ${orderData.phone || 'Not provided'}</p>
                        <p><strong>Product:</strong> ${orderData.nameOfProduct}</p>
                        <p><strong>Selected Color:</strong> ${orderData.selectedColor}</p>
                    </div>
                    <div>
                        <p><strong>Quantity:</strong> ${orderData.quantity}</p>
                        <p><strong>Price:</strong> ${orderData.priceOfProduct} AED</p>
                        <p><strong>Page:</strong> ${orderData.page}</p>
                        <p><strong>Exit Reason:</strong> ${orderData.exitReason}</p>
                    </div>
                </div>
                
                ${orderData.timestamp ? `
                <div style="background: #e9ecef; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #495057; margin-top: 0;">Tracking Information</h3>
                    <p><strong>Timestamp:</strong> ${new Date(orderData.timestamp).toLocaleString()}</p>
                    <p><strong>User Agent:</strong> ${orderData.userAgent}</p>
                </div>
                ` : ''}
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding: 20px; background: #d4edda; border-radius: 10px;">
                <p style="margin: 0; color: #155724;">⚠️ Follow up with this customer to complete the order!</p>
                <p style="margin: 10px 0 0; color: #155724;">Customer may need assistance or have questions.</p>
            </div>
        </div>
    `;

    return await sendEmail({
        to: process.env.ADMIN_EMAIL || 'admin@omexuae.com',
        subject: `Incomplete Order - ${orderData.nameClient}`,
        html: htmlContent,
        text: `Incomplete Order Alert\n\nCustomer: ${orderData.nameClient}\nProduct: ${orderData.nameOfProduct}\nExit Reason: ${orderData.exitReason}`
    });
};

module.exports = {
    sendEmail,
    sendOrderConfirmation,
    sendIncompleteOrderNotification
};
