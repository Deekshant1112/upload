












const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();

// Serve static files from the "public" folder (frontend files like HTML, JS, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Multer setup for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath); // Create 'uploads' directory if it doesn't exist
    }
    cb(null, uploadPath); // Save images to the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, `screenshot-${Date.now()}.png`); // File name with timestamp
  }
});

const upload = multer({ storage });

// POST endpoint to handle image upload and send via email
app.post('/api/send-email', upload.single('screenshot'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded!' });
    }

    const screenshotPath = path.join(__dirname, 'uploads', req.file.filename);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'deepurohit99@gmail.com', // Replace with your Gmail
        pass: "kjtl wtdc rhat kzce"   // Replace with your App Password
      }
    });

    const mailOptions = {
      from: 'deepurohit99@gmail.com',
      to: 'freshfarmora@gmail.com',
      subject: '📸 Screenshot Captured',
      html: `
        <h2>Screenshot Captured</h2>
        <p>Here's the screenshot taken:</p>
        <p>Check the attached file.</p>
      `,
      attachments: [{
        filename: req.file.filename,
        path: screenshotPath,
        cid: 'screenshot'
      }]
    };

    // Send email with the screenshot as an attachment
    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully with screenshot!');

    // Clean up the uploaded file after sending the email
    fs.unlinkSync(screenshotPath);

    res.status(200).json({ message: 'Screenshot sent successfully!' });
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    res.status(500).json({ message: 'Failed to send email.', error: error.toString() });
  }
});

// Serve the frontend index.html for any unknown routes (handling frontend routes)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'script.html')); // Ensure this is correct path for your HTML file
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
