import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const RECIPIENT_EMAIL = process.env.CONTACT_EMAIL || 'info@sothebysrealty.fi';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.office365.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, subject, message, language, turnstileToken } = body;

    if (!firstName || !lastName || !email || !message) {
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

    const subjectLine = subject
      ? `${language === 'sv' ? 'Kontakt' : language === 'en' ? 'Contact Inquiry' : 'Yhteydenotto'}: ${subject}`
      : `${language === 'sv' ? 'Kontaktformulär' : language === 'en' ? 'Contact Form' : 'Yhteydenottolomake'} - sothebysrealty.fi`;

    const htmlBody = `
      <h2>${subjectLine}</h2>
      <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 140px;">Name</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${firstName} ${lastName}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Email</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${email}">${email}</a></td></tr>
        ${phone ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Phone</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="tel:${phone}">${phone}</a></td></tr>` : ''}
        ${subject ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Subject</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${subject}</td></tr>` : ''}
        <tr><td style="padding: 8px; font-weight: bold; vertical-align: top;">Message</td><td style="padding: 8px; white-space: pre-wrap;">${message}</td></tr>
      </table>
      <hr style="margin-top: 20px;" />
      <p style="color: #999; font-size: 12px;">Sent from sothebysrealty.fi contact form (${language})</p>
    `;

    await transporter.sendMail({
      from: `"Sotheby's Realty Website" <${process.env.SMTP_USER}>`,
      to: RECIPIENT_EMAIL,
      replyTo: email,
      subject: subjectLine,
      html: htmlBody,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
