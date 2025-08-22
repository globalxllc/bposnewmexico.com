// api/send-email.example.js
import nodemailer from 'nodemailer';
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const data = req.body || {};
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });
    const to = process.env.TO_EMAIL || 'globalxllc@gmail.com';
    const html = `<h2>New BPO Intake</h2><pre>${JSON.stringify(data, null, 2)}</pre>`;
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'no-reply@bposnewmexico.com',
      to, subject: 'New BPO Intake Request', html
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Email failed' });
  }
}
