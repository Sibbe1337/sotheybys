import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const maxDuration = 30;

const RECIPIENT_EMAIL = process.env.CONTACT_EMAIL || 'info@sothebysrealty.fi';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.office365.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 20000,
});

async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // Skip verification if no secret configured
  
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret, response: token }),
  });
  const data = await res.json();
  return data.success === true;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, subject, message, language, turnstileToken } = body;

    if (!firstName || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify Turnstile CAPTCHA
    if (process.env.TURNSTILE_SECRET_KEY) {
      if (!turnstileToken) {
        return NextResponse.json({ error: 'CAPTCHA required' }, { status: 400 });
      }
      const valid = await verifyTurnstile(turnstileToken);
      if (!valid) {
        return NextResponse.json({ error: 'CAPTCHA verification failed' }, { status: 403 });
      }
    }

    // Sanitize all user input
    const safeFirstName = escapeHtml(String(firstName));
    const safeLastName = escapeHtml(String(lastName || ''));
    const safeEmail = escapeHtml(String(email));
    const safePhone = escapeHtml(String(phone || ''));
    const safeSubject = escapeHtml(String(subject || ''));
    const safeMessage = escapeHtml(String(message));
    const safeLang = ['fi', 'sv', 'en'].includes(language) ? language : 'fi';

    const subjectLine = safeSubject
      ? `${safeLang === 'sv' ? 'Kontakt' : safeLang === 'en' ? 'Contact Inquiry' : 'Yhteydenotto'}: ${safeSubject}`
      : `${safeLang === 'sv' ? 'Kontaktformulär' : safeLang === 'en' ? 'Contact Form' : 'Yhteydenottolomake'} - sothebysrealty.fi`;

    const htmlBody = `
      <h2>${subjectLine}</h2>
      <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 140px;">Name</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safeFirstName} ${safeLastName}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Email</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${safeEmail}">${safeEmail}</a></td></tr>
        ${safePhone ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Phone</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="tel:${safePhone}">${safePhone}</a></td></tr>` : ''}
        ${safeSubject ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Subject</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safeSubject}</td></tr>` : ''}
        <tr><td style="padding: 8px; font-weight: bold; vertical-align: top;">Message</td><td style="padding: 8px; white-space: pre-wrap;">${safeMessage}</td></tr>
      </table>
      <hr style="margin-top: 20px;" />
      <p style="color: #999; font-size: 12px;">Sent from sothebysrealty.fi contact form (${safeLang})</p>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_USER || 'info@sothebysrealty.fi',
      to: RECIPIENT_EMAIL,
      replyTo: email,
      subject: subjectLine,
      html: htmlBody,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error('Contact form error:', err.message);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
