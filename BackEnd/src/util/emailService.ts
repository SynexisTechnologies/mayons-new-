import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT) || 465;
// secure = true for port 465 (implicit SSL), false for 587 (STARTTLS)
const SMTP_SECURE =
  process.env.SMTP_SECURE !== undefined
    ? process.env.SMTP_SECURE === "true"
    : SMTP_PORT === 465;

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_FROM = process.env.EMAIL_FROM || `Mayans <${EMAIL_USER}>`;

/**
 * Build the transport. When SMTP_HOST is provided we use a custom SMTP server
 * (e.g. cPanel mail.mayons.lk). Otherwise we fall back to Gmail's service.
 */
const transporter = nodemailer.createTransport(
  SMTP_HOST
    ? {
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_SECURE,
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASS,
        },
      }
    : {
        service: "gmail",
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASS,
        },
      }
);

// Verify the SMTP connection once at startup so misconfiguration is obvious.
transporter.verify((error) => {
  if (error) {
    console.error("SMTP connection failed:", error.message);
  } else {
    console.log(
      `SMTP ready (${SMTP_HOST || "gmail"}${SMTP_HOST ? `:${SMTP_PORT}` : ""})`
    );
  }
});

const otpTemplate = (otp: string) => `
  <div style="font-family:Inter,Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#faf9f6;border-radius:16px;color:#1c1c1c;">
    <h2 style="margin:0 0 8px;font-size:22px;color:#1f3d2b;">Mayans</h2>
    <p style="margin:0 0 24px;font-size:14px;color:#6b6b6b;">Your one-time verification code</p>
    <div style="font-size:34px;font-weight:700;letter-spacing:8px;text-align:center;color:#1f3d2b;background:#fff;border:1px solid #e7e5e0;border-radius:12px;padding:18px 0;">
      ${otp}
    </div>
    <p style="margin:24px 0 0;font-size:13px;color:#6b6b6b;">This code expires in <strong>5 minutes</strong>. If you didn't request it, you can safely ignore this email.</p>
  </div>
`;

export const sendOTPEmail = async (to: string, otp: string) => {
  try {
    await transporter.sendMail({
      from: EMAIL_FROM,
      to,
      subject: "Your Mayans verification code",
      text: `Your OTP code is: ${otp}. It expires in 5 minutes.`,
      html: otpTemplate(otp),
    });

    console.log(`OTP email sent to ${to}`);
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw error;
  }
};

/** Generic email helper for future transactional emails. */
export const sendEmail = async (opts: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}) => {
  try {
    await transporter.sendMail({
      from: EMAIL_FROM,
      to: opts.to,
      subject: opts.subject,
      text: opts.text,
      html: opts.html,
    });
    console.log(`Email "${opts.subject}" sent to ${opts.to}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
