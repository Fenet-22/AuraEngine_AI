import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { blueprintId, name, phone, email, eventDate, notes } = body;

    if (!blueprintId || !name || !phone || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const proposalRequest = await (prisma as any).proposalRequest.create({
      data: {
        blueprintId,
        name,
        phone,
        email,
        eventDate: eventDate ? new Date(eventDate) : null,
        city: body.city,
        proposalType: body.proposalType,
        notes,
      },
    });

    const blueprint = await prisma.eventBlueprint.findUnique({
      where: { id: blueprintId }
    });

    // Initialize Nodemailer transporter
    let transporter;
    
    // If SMTP_HOST is not provided, use Ethereal for testing
    if (!process.env.SMTP_HOST) {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    } else {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587", 10),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    }

    const info = await transporter.sendMail({
      from: process.env.SMTP_USER ? `"Yenege Events" <${process.env.SMTP_USER}>` : '"Yenege Events" <hello@yenege.com>',
      to: email, // Send to the user's email
      subject: "Your Curated Event Proposal Request - Yenege",
      text: `YENEGE - Luxury Event Architects\n\nDear ${name},\n\nThank you for requesting a curated proposal. Our sensory architects have received your event concept and will prepare a bespoke quotation aligned with your experience goals.\n\n--- Your Event Concept ---\nTheme: ${blueprint?.theme || 'N/A'}\nEvent Type: ${blueprint?.eventType || 'N/A'}\nExpected Guests: ${blueprint?.guestCount || 'N/A'}\nVenue Profile: ${blueprint?.venueType || 'N/A'}\nSpatial Layout: ${blueprint?.layout || 'N/A'}\nEstimated Budget: ETB ${blueprint?.budget?.toLocaleString() || 'Custom Allocation'}\n\n--- Proposal Details ---\nRequested Service: ${body.proposalType || 'Not specified'}\nEvent Date: ${eventDate || 'TBD'}\nCity / Venue: ${body.city || 'TBD'}\nPhone Number: ${phone}\nAdditional Notes: ${notes || 'None provided'}\n\nReference Number: YEN-${new Date().getFullYear()}-${proposalRequest.id.substring(proposalRequest.id.length - 5).toUpperCase()}\n\n--- Next Steps ---\nWithin 24-48 business hours, our executive team will:\n1. Review your blueprint\n2. Prepare an initial proposal\n3. Contact you for refinement if necessary\n4. Schedule consultation (optional)\n\nView Your Concept:\n${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/blueprint/${blueprintId}\n\nNeed immediate assistance?\nhello@yenege.com | +251 91 123 4567`,
      html: `<div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; color: #333333; padding: 40px; border-radius: 12px; border: 1px solid #eaeaea; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #000000; font-size: 24px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; margin: 0;">YENEGE</h1>
          <p style="color: #888888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-top: 5px;">Luxury Event Architects</p>
        </div>
        
        <p style="font-size: 16px; line-height: 1.6; color: #444444;">Dear <strong>${name}</strong>,</p>
        <p style="font-size: 16px; line-height: 1.6; color: #444444; margin-bottom: 5px;">Thank you for requesting a curated proposal.</p>
        <p style="font-size: 16px; line-height: 1.6; color: #444444; margin-top: 0;">Our sensory architects have received your event concept and will prepare a bespoke quotation aligned with your experience goals.</p>
        
        <div style="margin: 35px 0; border-top: 2px solid #f4f4f4; border-bottom: 2px solid #f4f4f4; padding: 25px 0;">
          <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px; color: #000000; margin-top: 0; margin-bottom: 20px;">Your Event Concept</h3>
          
          ${blueprint?.conceptImage ? `<div style="margin-bottom: 25px; border-radius: 8px; overflow: hidden; border: 1px solid #eaeaea;"><img src="${blueprint.conceptImage}" alt="Event Concept" style="width: 100%; height: auto; display: block;" /></div>` : ''}

          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #888888; font-size: 14px; width: 40%;">Theme</td>
              <td style="padding: 8px 0; color: #111111; font-size: 14px; font-weight: 600;">${blueprint?.theme || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #888888; font-size: 14px;">Event Type</td>
              <td style="padding: 8px 0; color: #111111; font-size: 14px; font-weight: 600;">${blueprint?.eventType || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #888888; font-size: 14px;">Expected Guests</td>
              <td style="padding: 8px 0; color: #111111; font-size: 14px; font-weight: 600;">${blueprint?.guestCount || 'N/A'} Guests</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #888888; font-size: 14px;">Venue Profile</td>
              <td style="padding: 8px 0; color: #111111; font-size: 14px; font-weight: 600;">${blueprint?.venueType || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #888888; font-size: 14px;">Spatial Layout</td>
              <td style="padding: 8px 0; color: #111111; font-size: 14px; font-weight: 600;">${blueprint?.layout || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #888888; font-size: 14px;">Estimated Budget</td>
              <td style="padding: 8px 0; color: #111111; font-size: 14px; font-weight: 600;">ETB ${blueprint?.budget?.toLocaleString() || 'Custom Allocation'}</td>
            </tr>
          </table>
        </div>
        
        <div style="background-color: #fafafa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <h4 style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #888888; margin-top: 0; margin-bottom: 15px;">Proposal Details</h4>
          <p style="font-size: 13px; margin: 8px 0; color: #555555;"><strong>Requested Service:</strong> ${body.proposalType || 'Not specified'}</p>
          <p style="font-size: 13px; margin: 8px 0; color: #555555;"><strong>Event Date:</strong> ${eventDate ? new Date(eventDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'TBD'}</p>
          <p style="font-size: 13px; margin: 8px 0; color: #555555;"><strong>City / Venue:</strong> ${body.city || 'TBD'}</p>
          <p style="font-size: 13px; margin: 8px 0; color: #555555;"><strong>Phone Number:</strong> ${phone}</p>
          <p style="font-size: 13px; margin: 8px 0; color: #555555;"><strong>Additional Notes:</strong> ${notes || 'None provided'}</p>
        </div>
        
        <div style="margin-bottom: 30px; text-align: center;">
          <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #888888; margin-bottom: 5px;">Reference Number</p>
          <p style="font-size: 16px; font-weight: 700; color: #111111; margin: 0;">YEN-${new Date().getFullYear()}-${proposalRequest.id.substring(proposalRequest.id.length - 5).toUpperCase()}</p>
        </div>

        <div style="border: 1px solid #eaeaea; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
          <h4 style="font-size: 14px; color: #000000; margin-top: 0; margin-bottom: 15px;">Next Steps</h4>
          <p style="font-size: 14px; color: #444444; margin-top: 0; margin-bottom: 10px;">Within <strong>24-48 business hours</strong>, our executive team will:</p>
          <ol style="font-size: 14px; color: #555555; margin: 0; padding-left: 20px; line-height: 1.6;">
            <li>Review your blueprint</li>
            <li>Prepare an initial proposal</li>
            <li>Contact you for refinement if necessary</li>
            <li>Schedule consultation (optional)</li>
          </ol>
        </div>

        <div style="text-align: center; margin-bottom: 40px;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/blueprint/${blueprintId}" style="display: inline-block; background-color: #d4a000; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; font-size: 14px; letter-spacing: 0.5px;">View Your Concept</a>
        </div>

        <div style="border-top: 1px solid #eaeaea; padding-top: 20px; text-align: center;">
          <p style="font-size: 12px; color: #888888; margin-bottom: 5px;">Need immediate assistance?</p>
          <p style="font-size: 12px; color: #888888; margin: 0;"><a href="mailto:hello@yenege.com" style="color: #d4a000; text-decoration: none;">hello@yenege.com</a> | +251 91 123 4567</p>
        </div>
      </div>`,
    });

    console.log("Proposal email sent: %s", info.messageId);
    
    let previewUrl = null;
    if (!process.env.SMTP_HOST) {
      previewUrl = nodemailer.getTestMessageUrl(info);
      console.log("Ethereal Email Preview URL: %s", previewUrl);
    }

    return NextResponse.json({ 
      success: true, 
      proposalRequest,
      emailPreview: previewUrl
    });
  } catch (error) {
    console.error('Error saving proposal request:', error);
    return NextResponse.json(
      { error: 'Failed to submit proposal request' },
      { status: 500 }
    );
  }
}
