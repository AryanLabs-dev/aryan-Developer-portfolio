import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import nodemailer from "nodemailer";

const app = express();
const PORT = Number(process.env.PORT || 5000);

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json({ limit: "20kb" }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false
});
app.use("/api/contact", limiter);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "Aryan Singh Portfolio API" });
});

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message, website } = req.body || {};

    if (website) return res.json({ ok: true, message: "Message received." });
    if (!name || !email || !message) {
      return res.status(400).json({ ok: false, message: "Please fill in all fields." });
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) return res.status(400).json({ ok: false, message: "Please enter a valid email." });
    if (String(message).trim().length < 10) {
      return res.status(400).json({ ok: false, message: "Message must be at least 10 characters." });
    }

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.CONTACT_TO) {
      return res.status(503).json({
        ok: false,
        message: "Email service is not configured yet. Add the Gmail App Password to .env."
      });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT || 465),
      secure: String(process.env.SMTP_SECURE ?? "true") === "true",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });

    await transporter.sendMail({
      from: `"Aryan Portfolio" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_TO,
      replyTo: email,
      subject: `Portfolio message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`
    });

    res.json({ ok: true, message: "Message sent successfully." });
  } catch (error) {
    console.error("CONTACT_ERROR:", error);
    res.status(500).json({ ok: false, message: "Could not send the message. Check the server and SMTP settings." });
  }
});

app.listen(PORT, () => {
  console.log(`✓ Portfolio API running at http://localhost:${PORT}`);
});
