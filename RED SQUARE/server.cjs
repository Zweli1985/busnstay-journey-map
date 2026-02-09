const express = require('express');
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const sqlite3 = require('sqlite3').verbose();
const nodemailer = require('nodemailer');
const winston = require('winston');
const cors = require('cors');
const basicAuth = require('express-basic-auth');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const axios = require('axios'); // Add for Yoco API calls
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form data
app.use(express.static(path.join(__dirname))); // Serve index.html, images, etc.

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({ format: winston.format.simple() }));
}

const db = new sqlite3.Database('tickets.db', (err) => {
  if (err) { logger.error('Database connection error:', err); }
  else { logger.info('Connected to SQLite database'); }
});

// Tables (unchanged)
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS tickets (
    serialNumber TEXT PRIMARY KEY,
    name TEXT,
    email TEXT,
    event TEXT,
    ticketType TEXT,
    date TEXT,
    used INTEGER DEFAULT 0
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS votes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    serialNumber TEXT,
    dj TEXT,
    round TEXT,
    timestamp TEXT,
    UNIQUE(serialNumber, round)
  )`);
});

// Mailer (unchanged)
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Yoco Integration
const YOCO_SECRET_KEY = process.env.YOCO_SECRET_KEY;
const YOCO_BASE_URL = 'https://payments.yoco.com/api/checkouts';

app.post('/initiate-yoco-payment', async (req, res) => {
  logger.info('Received /initiate-yoco-payment request:', req.body);
  const { name, email, event, ticketType } = req.body;

  // Validate input (same as PayFast)
  if (!name || !email.includes('@') || !['pmb', 'newcastle', 'portshepstone'].includes(event) || !['early', 'phase1', 'phase2', 'gate', 'vip'].includes(ticketType)) {
    logger.error('Invalid Yoco payment request data:', req.body);
    return res.status(400).json({ success: false, error: 'Invalid input data' });
  }

  const eventMap = { pmb: 'Pietermaritzburg', newcastle: 'Newcastle', portshepstone: 'Port Shepstone' };
  const ticketPrice = { early: 80, phase1: 120, phase2: 150, gate: 200, vip: 500 };
  const dates = { pmb: '2025-11-01', newcastle: '2025-11-29', portshepstone: '2025-12-16' };

  const serialNumber = `TCKT-${crypto.randomBytes(3).toString('hex').toUpperCase()}-${event.toUpperCase()}`;
  const amount = ticketPrice[ticketType]; // Yoco uses cents, so multiply by 100

  if (!YOCO_SECRET_KEY) {
    logger.error('Yoco secret key not configured');
    return res.status(500).json({ success: false, error: 'Yoco not configured' });
  }

  try {
    // Create Yoco checkout session
    const yocoResponse = await axios.post(YOCO_BASE_URL, {
      amount: amount * 100, // Convert to cents (ZAR)
      currency: 'ZAR',
      name: 'Red Square DJ Knockout Ticket',
      description: `Ticket for ${eventMap[event]} - ${ticketType}`,
      customer: {
        email: email,
        first_name: name.split(' ')[0] || name,
        last_name: name.split(' ').slice(1).join(' ') || '',
      },
      site: {
        host: 'redsquaredjchallenge.co.za', // Your site domain
      },
      redirect: {
        success: `${process.env.NGROK_URL || 'http://localhost:3000'}/yoco-success?serial=${serialNumber}`,
        cancel: `${process.env.NGROK_URL || 'http://localhost:3000'}/yoco-cancel`,
      },
      notification: `${process.env.NGROK_URL || 'http://localhost:3000'}/yoco-notify`,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${YOCO_SECRET_KEY}`,
      },
    });

    const { id: checkoutId, redirect: paymentUrl } = yocoResponse.data;

    // Save ticket to database (pending payment)
    db.run(
      "INSERT INTO tickets (serialNumber, name, email, event, ticketType, date) VALUES (?, ?, ?, ?, ?, ?)",
      [serialNumber, name, email, eventMap[event], ticketType, dates[event]],
      (err) => {
        if (err) {
          logger.error('Error inserting ticket:', err);
          return res.status(500).json({ success: false, error: 'Failed to save ticket' });
        }
        logger.info('Ticket saved to database:', { serialNumber });
      }
    );

    logger.info('Yoco checkout created:', { checkoutId, paymentUrl });
    res.json({ success: true, paymentUrl, debug: yocoResponse.data });
  } catch (error) {
    logger.error('Yoco payment initiation error:', error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.response?.data?.message || error.message });
  }
});

// Yoco Success Endpoint
app.get('/yoco-success', (req, res) => {
  const serial = req.query.serial;
  res.send(`Payment Successful! Ticket serial: ${serial}. Check your email for details.`);
});

// Yoco Cancel Endpoint
app.get('/yoco-cancel', (req, res) => {
  res.send('Payment Cancelled.');
});

// Yoco Notify Endpoint (Webhook)
app.post('/yoco-notify', express.urlencoded({ extended: true }), async (req, res) => {
  logger.info('Received Yoco notify:', req.body);
  const { event, data } = req.body;

  if (event === 'payment.success') {
    const { id: paymentId, amount, customer } = data;
    const serialNumber = data.custom_attributes?.serial || 'unknown'; // Pass serial in custom_attributes if needed

    // Update ticket as used
    db.run("UPDATE tickets SET used = 0 WHERE serialNumber = ?", [serialNumber], (err) => {
      if (err) logger.error('Error updating ticket status:', err);
      else logger.info('Ticket status updated:', { serialNumber });
    });

    // Get ticket details
    db.get("SELECT * FROM tickets WHERE serialNumber = ?", [serialNumber], async (err, row) => {
      if (err || !row) {
        logger.error('Ticket not found for notify:', { serialNumber, error: err });
        return;
      }

      // Generate PDF (same as PayFast)
      const doc = new PDFDocument();
      const pdfPath = `tickets/ticket_${serialNumber}.pdf`;
      doc.pipe(fs.createWriteStream(pdfPath));
      doc.fontSize(20).text('Red Square DJ Knockout 2025', { align: 'center' });
      doc.fontSize(16).text(`Ticket for ${row.name}`, { align: 'center' });
      doc.text(`Event: ${row.event}`, { align: 'center' });
      doc.text(`Date: ${row.date}`, { align: 'center' });
      doc.text(`Type: ${row.ticketType}`, { align: 'center' });
      doc.text(`Serial: ${serialNumber}`, { align: 'center' });
      const qrCodeData = await QRCode.toDataURL(serialNumber);
      doc.image(qrCodeData, { align: 'center', valign: 'center', width: 150 });
      doc.end();

      // Send email
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: row.email,
        subject: 'Your Red Square DJ Knockout 2025 Ticket',
        text: `Thank you for your purchase! Your ticket details:\nSerial: ${serialNumber}\nEvent: ${row.event}\nDate: ${row.date}\nType: ${row.ticketType}`,
        attachments: [{ filename: `ticket_${serialNumber}.pdf`, path: pdfPath }]
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) logger.error('Email sending error:', error);
        else logger.info('Email sent:', info.response);
      });
    });
  }

  res.sendStatus(200);
});

// Existing PayFast endpoints (unchanged - keep for fallback)
// ... (your existing PayFast code here: /initiate-payment, /notify, /success, /cancel, etc.)

// Existing other endpoints (unchanged)
// ... (your existing /verify, /vote, /vote-results, /scanner, /admin, / endpoints)

app.listen(3000, () => { logger.info('Server running on http://localhost:3000'); });