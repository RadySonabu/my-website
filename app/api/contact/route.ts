import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { contactFormSchema, isRateLimited } from "@/app/lib/contact";
import {
  contactAutoReplyEmail,
  contactNotificationEmail,
} from "@/app/lib/emailTemplates";

const RATE_LIMIT = { max: 3, windowMs: 15 * 60 * 1000 };
const submissionsByIp = new Map<string, number[]>();

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = contactFormSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  if (parsed.data.website) {
    // Honeypot field was filled - silently succeed without sending anything.
    return NextResponse.json({ success: true });
  }

  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  if (isRateLimited(submissionsByIp, ip, Date.now(), RATE_LIMIT)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser || !gmailAppPassword) {
    return NextResponse.json(
      { error: "Unable to send message right now." },
      { status: 500 },
    );
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: gmailUser, pass: gmailAppPassword },
  });

  // Gmail "+ addressing": mail to user+tag@gmail.com still lands in the same
  // inbox as user@gmail.com, but can be filtered/labeled on the "+tag" part.
  const [localPart, domain] = gmailUser.split("@");
  const notifyAddress = `${localPart}+ubanox@${domain}`;

  const notification = contactNotificationEmail(parsed.data);

  try {
    await transporter.sendMail({
      from: `"Ubanox" <${gmailUser}>`,
      to: notifyAddress,
      replyTo: parsed.data.email,
      subject: notification.subject,
      text: notification.text,
      html: notification.html,
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to send message right now." },
      { status: 500 },
    );
  }

  // Best-effort auto-reply to the sender - the notification above already
  // succeeded, so a failure here shouldn't turn the submission into an error.
  try {
    const autoReply = contactAutoReplyEmail(parsed.data);
    await transporter.sendMail({
      from: `"Ubanox" <${gmailUser}>`,
      to: parsed.data.email,
      subject: autoReply.subject,
      text: autoReply.text,
      html: autoReply.html,
    });
  } catch {
    // Notification already sent; nothing else to do if only the auto-reply fails.
  }

  return NextResponse.json({ success: true });
}
