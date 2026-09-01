import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { contactFormSchema, isRateLimited } from "@/app/lib/contact";

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

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: gmailUser, pass: gmailAppPassword },
    });

    await transporter.sendMail({
      from: gmailUser,
      to: gmailUser,
      replyTo: parsed.data.email,
      subject: `New contact form message from ${parsed.data.name}`,
      text: `From: ${parsed.data.name} <${parsed.data.email}>\n\n${parsed.data.message}`,
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to send message right now." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
