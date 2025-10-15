const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  // For Gmail, you need to enable "Less secure app access" or use App Password
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send dish request notification email
const sendDishRequestEmail = async (dishRequest) => {
  try {
    const transporter = createTransporter();
   
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.NOTIFICATION_EMAIL,
      subject: `New Dish Request: ${dishRequest.dishName}`,
      html: `
        <h2>New Dish Request Received</h2>
        <p><strong>Dish Name:</strong> ${dishRequest.dishName}</p>
        <p><strong>Description:</strong> ${dishRequest.description || 'No description provided'}</p>
        <p><strong>Requested by:</strong> ${dishRequest.userName}</p>
        <p><strong>User Email:</strong> ${dishRequest.userEmail}</p>
        <p><strong>Request Date:</strong> ${new Date(dishRequest.createdAt).toLocaleString()}</p>
        <hr>
        <p>Please review and add this dish to the app if appropriate.</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending failed:', error);
    // Don't throw error - we don't want to fail the request if email fails
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendDishRequestEmail
};


