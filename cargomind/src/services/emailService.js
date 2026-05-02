/**
 * emailService.js — CargoMind OTP Email Delivery
 *
 * Uses EmailJS (https://www.emailjs.com) — a free service that lets
 * you send emails directly from browser JavaScript WITHOUT a backend server.
 *
 * HOW IT WORKS:
 *   1. You create a free EmailJS account
 *   2. Connect your Gmail/Outlook as the sender
 *   3. Create an email template with {{otp}}, {{to_name}}, {{to_email}} variables
 *   4. EmailJS gives you: SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY
 *   5. We call emailjs.send() from the browser → EmailJS server → your Gmail → user inbox
 *
 * FREE TIER: 200 emails/month — plenty for a portfolio/demo project.
 *
 * SETUP INSTRUCTIONS (5 minutes):
 *   1. Go to https://www.emailjs.com → Sign up free
 *   2. Dashboard → Email Services → Add Service → Gmail → Connect
 *      (copy the Service ID — looks like "service_xxxxxxx")
 *   3. Email Templates → Create Template:
 *      Subject: "Your CargoMind OTP: {{otp}}"
 *      Body:
 *        Hi {{to_name}},
 *        Your CargoMind verification code is: {{otp}}
 *        This code expires in 10 minutes.
 *        — CargoMind Team
 *      (copy the Template ID — looks like "template_xxxxxxx")
 *   4. Account → General → Public Key (copy it)
 *   5. Create src/.env file:
 *      REACT_APP_EMAILJS_SERVICE_ID=service_xxxxxxx
 *      REACT_APP_EMAILJS_TEMPLATE_ID=template_xxxxxxx
 *      REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key
 *
 * WITHOUT SETUP: The app falls back gracefully — OTP shown in an
 * on-screen alert box so you can still test the full flow.
 */

import emailjs from '@emailjs/browser';

const SERVICE_ID  = process.env.REACT_APP_EMAILJS_SERVICE_ID  || '';
const TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || '';
const PUBLIC_KEY  = process.env.REACT_APP_EMAILJS_PUBLIC_KEY  || '';

const IS_CONFIGURED = SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY;

/**
 * sendOtpEmail — sends the OTP to the user's email address.
 *
 * @param {string} toEmail  - recipient email (e.g. "aryan@example.com")
 * @param {string} toName   - recipient name  (e.g. "Aryan Kumar")
 * @param {string} otp      - 6-digit OTP string
 * @returns {{ sent: boolean, fallback: boolean }}
 */
export async function sendOtpEmail(toEmail, toName, otp) {
  if (!IS_CONFIGURED) {
    // Dev/demo mode — show OTP in an on-screen notification
    console.log(`%c[CargoMind OTP] Code for ${toEmail}: ${otp}`, 'color:#00d4ff;font-size:20px;font-weight:bold;');
    return { sent: false, fallback: true, otp };
  }

  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        to_email: toEmail,
        to_name:  toName,
        otp:      otp,
        expires:  '10 minutes',
        app_name: 'CargoMind',
      },
      PUBLIC_KEY
    );
    return { sent: true, fallback: false };
  } catch (err) {
    console.error('[EmailJS Error]', err);
    // Graceful fallback — still show OTP so demo works
    console.log(`%c[CargoMind OTP Fallback] ${otp}`, 'color:#f5c842;font-size:20px;font-weight:bold;');
    return { sent: false, fallback: true, otp, error: err.text || err.message };
  }
}

export const emailConfigured = IS_CONFIGURED;
