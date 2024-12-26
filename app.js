




const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const cors = require('cors');
app.use(express.static(path.join(__dirname, 'public'))); 

// const allowedOrigins = [
//   'https://newsite-feb0.onrender.com/',   // Development
//   'http://127.0.0.1:5500/' // Production Frontend URL
// ];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));


// Multer Setup for Handling Image Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save images to 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, `screenshot-${Date.now()}.png`);
  }
});

const upload = multer({ storage });

// Ensure 'uploads' directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// POST Endpoint to Handle Screenshot Upload and Send via Email
app.post('/api/send-email', upload.single('screenshot'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded!' });
    }

    const screenshotPath = path.join(__dirname, 'uploads', req.file.filename);

    // Configure Nodemailer
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

    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully with screenshot!');

    // Clean up uploaded file after sending
    fs.unlinkSync(screenshotPath);

    res.status(200).json({ message: 'Screenshot sent successfully!' });
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    res.status(500).json({ message: 'Failed to send email.', error: error.toString() });
  }
});
// Serve the frontend index.html for any unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
