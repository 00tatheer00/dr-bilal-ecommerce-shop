// Email Dispatcher for GULNAAR by MK
// Note: Dynamic imports used inside sendOrderEmails so server-side modules (node:net)
// are never bundled into client action manifests.

export interface OrderEmailItem {
  name: string;
  sku?: string | null;
  size?: string | null;
  color?: string | null;
  quantity: number;
  unitPriceMinor: number;
  totalMinor: number;
}

export interface SendOrderEmailsParams {
  orderNumber: string;
  trackingToken?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  province?: string | null;
  items: OrderEmailItem[];
  subtotalMinor: number;
  deliveryChargeMinor: number;
  totalMinor: number;
  paymentMethod: 'cod' | 'easypaisa' | 'bank_transfer';
  paymentReference?: string | null;
  senderAccountName?: string | null;
  specialInstructions?: string | null;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dbshop.vercel.app';
const STORE_NAME = 'GULNAAR by MK';
const STORE_EMAIL = process.env.SMTP_FROM || 'orders@gulnaarbymk.com';
const OWNER_EMAIL =
  process.env.ADMIN_ALERT_EMAIL ||
  process.env.ADMIN_EMAIL ||
  'admin@gulnaarbymk.com';

function formatPkr(minor: number): string {
  return `PKR ${(minor / 100).toLocaleString('en-PK')}`;
}

/**
 * 1. Customer Designed HTML Email (Luxury South Asian Aesthetic)
 */
export function generateCustomerOrderEmailHtml(data: SendOrderEmailsParams): string {
  const formattedSubtotal = formatPkr(data.subtotalMinor);
  const formattedDelivery =
    data.deliveryChargeMinor === 0 ? 'FREE' : formatPkr(data.deliveryChargeMinor);
  const formattedTotal = formatPkr(data.totalMinor);
  const trackUrl = `${SITE_URL}/track-order?ref=${data.orderNumber}`;
  const whatsappUrl = `https://wa.me/923125880988?text=Assalam-o-Alaikum%20Dr.%20Bilal!%20My%20order%20reference%20is%20${data.orderNumber}`;

  let paymentDetailsHtml = '';
  if (data.paymentMethod === 'easypaisa') {
    paymentDetailsHtml = `
      <div style="background-color: #E8F8F2; border-left: 4px solid #00C389; padding: 14px 18px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: bold; color: #00704F; text-transform: uppercase; letter-spacing: 0.5px;">
          ✓ Payment Mode: Easypaisa Mobile Transfer
        </p>
        <p style="margin: 0; font-size: 13px; color: #333333; line-height: 1.5;">
          <strong>Account:</strong> 03125880988 (Bilal Khan)<br />
          ${data.paymentReference ? `<strong>Submitted TRX ID:</strong> <span style="font-family: monospace; font-weight: bold; color: #00704F;">${data.paymentReference}</span><br />` : ''}
          <span style="font-size: 12px; color: #555555;">Our team is reconciling your TRX ID. You may also share your receipt screenshot on WhatsApp.</span>
        </p>
      </div>
    `;
  } else if (data.paymentMethod === 'bank_transfer') {
    paymentDetailsHtml = `
      <div style="background-color: #EBF2FA; border-left: 4px solid #1B3A6B; padding: 14px 18px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: bold; color: #1B3A6B; text-transform: uppercase; letter-spacing: 0.5px;">
          ✓ Payment Mode: Muslim Commercial Bank (MCB)
        </p>
        <p style="margin: 0; font-size: 13px; color: #333333; line-height: 1.5;">
          <strong>Account Title:</strong> Bilal Khan<br />
          <strong>IBAN:</strong> <span style="font-family: monospace; font-weight: bold;">PK16MUCB0857263901006723</span><br />
          ${data.paymentReference ? `<strong>Reference / Sender:</strong> <span style="font-family: monospace; font-weight: bold; color: #1B3A6B;">${data.paymentReference}</span><br />` : ''}
          <span style="font-size: 12px; color: #555555;">Payment verification is in progress.</span>
        </p>
      </div>
    `;
  } else {
    paymentDetailsHtml = `
      <div style="background-color: #FFF8E6; border-left: 4px solid #D4AF37; padding: 14px 18px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: bold; color: #996E00; text-transform: uppercase; letter-spacing: 0.5px;">
          ✓ Payment Mode: Cash on Delivery (COD)
        </p>
        <p style="margin: 0; font-size: 13px; color: #333333; line-height: 1.5;">
          Please inspect your jewellery parcel upon doorstep arrival and hand <strong>${formattedTotal}</strong> to the courier rider.
        </p>
      </div>
    `;
  }

  const itemsRows = data.items
    .map(
      (it) => `
      <tr style="border-bottom: 1px solid #EEEEEE;">
        <td style="padding: 12px 8px; font-size: 13px; color: #222222;">
          <strong style="color: #111111;">${it.name}</strong>
          ${it.size || it.color ? `<div style="font-size: 11px; color: #777777; margin-top: 2px;">${it.size ? `Size: ${it.size}` : ''} ${it.color ? `• Color: ${it.color}` : ''}</div>` : ''}
        </td>
        <td style="padding: 12px 8px; text-align: center; font-size: 13px; color: #555555;">
          ${it.quantity}
        </td>
        <td style="padding: 12px 8px; text-align: right; font-size: 13px; font-weight: bold; color: #B81D4E;">
          ${formatPkr(it.totalMinor)}
        </td>
      </tr>
    `
    )
    .join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - GULNAAR by MK</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8F7F4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #333333; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #F8F7F4; padding: 30px 10px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #E8E5DF;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #B81D4E 0%, #800F33 100%); padding: 36px 30px; text-align: center; border-bottom: 3px solid #D4AF37;">
              <h1 style="margin: 0; color: #FFFFFF; font-size: 26px; font-weight: 700; letter-spacing: 4px; font-family: 'Playfair Display', Georgia, serif;">
                GULNAAR
              </h1>
              <p style="margin: 6px 0 0 0; color: #F6D365; font-size: 11px; text-transform: uppercase; letter-spacing: 3px; font-weight: 600;">
                by MK • Lahore Atelier
              </p>
            </td>
          </tr>

          <!-- Welcome Message -->
          <tr>
            <td style="padding: 32px 30px 20px 30px;">
              <span style="display: inline-block; background-color: #FFF0F5; color: #B81D4E; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; padding: 4px 10px; border-radius: 20px; border: 1px solid #FAD1DE; margin-bottom: 12px;">
                ★ Order Confirmed
              </span>
              <h2 style="margin: 0 0 10px 0; font-size: 22px; color: #18181B; font-family: 'Playfair Display', Georgia, serif;">
                Thank You for Your Order, ${data.customerName}!
              </h2>
              <p style="margin: 0; font-size: 14px; color: #666666; line-height: 1.6;">
                Your order has been safely received. Our master artisans in Lahore are preparing and hand-polishing your heirloom jewellery set.
              </p>
            </td>
          </tr>

          <!-- Order Summary Card -->
          <tr>
            <td style="padding: 0 30px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAF9F6; border-radius: 12px; border: 1px solid #EAE7E1; padding: 16px 20px;">
                <tr>
                  <td>
                    <span style="font-size: 11px; color: #777777; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; display: block;">
                      Order Reference
                    </span>
                    <span style="font-size: 20px; font-family: monospace; font-weight: 700; color: #B81D4E; letter-spacing: 1px;">
                      ${data.orderNumber}
                    </span>
                  </td>
                  <td align="right">
                    <span style="font-size: 11px; color: #777777; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; display: block;">
                      Estimated Delivery
                    </span>
                    <span style="font-size: 13px; font-weight: bold; color: #111111;">
                      3–5 Business Days
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Payment Details Box -->
          <tr>
            <td style="padding: 0 30px;">
              ${paymentDetailsHtml}
            </td>
          </tr>

          <!-- Items Table -->
          <tr>
            <td style="padding: 10px 30px 20px 30px;">
              <h3 style="margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #B81D4E; font-weight: 700; border-bottom: 2px solid #F0EEEA; padding-bottom: 6px;">
                Ordered Jewellery Pieces (${data.items.length})
              </h3>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                <thead>
                  <tr style="border-bottom: 1px solid #E8E5DF; font-size: 11px; text-transform: uppercase; color: #777777; letter-spacing: 0.5px;">
                    <th align="left" style="padding: 8px 8px 8px 0;">Item Description</th>
                    <th align="center" style="padding: 8px;">Qty</th>
                    <th align="right" style="padding: 8px 0 8px 8px;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsRows}
                </tbody>
              </table>

              <!-- Totals Breakdown -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top: 16px;">
                <tr>
                  <td style="padding: 4px 0; font-size: 13px; color: #666666;">Subtotal</td>
                  <td align="right" style="padding: 4px 0; font-size: 13px; font-weight: 600; color: #222222;">${formattedSubtotal}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; font-size: 13px; color: #666666;">Nationwide Delivery</td>
                  <td align="right" style="padding: 4px 0; font-size: 13px; font-weight: 600; color: #222222;">${formattedDelivery}</td>
                </tr>
                <tr style="border-top: 2px solid #B81D4E;">
                  <td style="padding: 12px 0 4px 0; font-size: 15px; font-weight: 700; color: #111111;">Total Payable</td>
                  <td align="right" style="padding: 12px 0 4px 0; font-size: 20px; font-weight: 700; color: #B81D4E;">${formattedTotal}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Delivery Address Block -->
          <tr>
            <td style="padding: 0 30px 24px 30px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAF9F6; border-radius: 10px; border: 1px solid #EAE7E1; padding: 14px 18px;">
                <tr>
                  <td>
                    <span style="font-size: 11px; text-transform: uppercase; color: #777777; font-weight: 700; letter-spacing: 0.5px; display: block; margin-bottom: 4px;">
                      📍 Delivery Address
                    </span>
                    <p style="margin: 0; font-size: 13px; color: #222222; line-height: 1.5;">
                      <strong>${data.customerName}</strong><br />
                      ${data.addressLine1}${data.addressLine2 ? `, ${data.addressLine2}` : ''}<br />
                      ${data.city}, ${data.province || 'Pakistan'}<br />
                      <strong>Phone:</strong> ${data.customerPhone}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Action Buttons -->
          <tr>
            <td align="center" style="padding: 10px 30px 36px 30px;">
              <a href="${trackUrl}" target="_blank" style="display: inline-block; background-color: #B81D4E; color: #FFFFFF; font-size: 13px; font-weight: 700; text-decoration: none; padding: 14px 28px; border-radius: 8px; margin: 4px 6px; letter-spacing: 0.5px;">
                Track Order Status →
              </a>
              <a href="${whatsappUrl}" target="_blank" style="display: inline-block; background-color: #25D366; color: #FFFFFF; font-size: 13px; font-weight: 700; text-decoration: none; padding: 14px 24px; border-radius: 8px; margin: 4px 6px; letter-spacing: 0.5px;">
                💬 Message on WhatsApp
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #FAF9F6; padding: 24px 30px; text-align: center; border-top: 1px solid #E8E5DF; font-size: 11px; color: #888888; line-height: 1.6;">
              <p style="margin: 0 0 6px 0; font-weight: bold; color: #B81D4E;">
                GULNAAR by MK — Handcrafted Heirloom Jewellery
              </p>
              <p style="margin: 0 0 8px 0;">
                Gulberg III, Lahore, Punjab, Pakistan • WhatsApp: 0312-5880988 / 0327-5792600
              </p>
              <p style="margin: 0; color: #AAAAAA;">
                © 2026 GULNAAR by MK. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * 2. Website Owner (Doctor Bilal / Admin) New Order Alert Email
 */
export function generateOwnerOrderAlertEmailHtml(data: SendOrderEmailsParams): string {
  const formattedTotal = formatPkr(data.totalMinor);
  const portalUrl = `${SITE_URL}/admin/orders`;
  const cleanPhone = data.customerPhone.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/92${cleanPhone.slice(-10)}?text=Assalam-o-Alaikum%20${encodeURIComponent(data.customerName)},%20this%20is%20Dr.%20Bilal%20from%20GULNAAR%20by%20MK%20regarding%20your%20order%20${data.orderNumber}.`;

  const itemsList = data.items
    .map(
      (it) => `
      <li style="margin-bottom: 6px; font-size: 13px; color: #222222;">
        <strong>${it.name}</strong> × ${it.quantity} sets
        ${it.size ? `(Size: ${it.size})` : ''} — 
        <strong style="color: #B81D4E;">${formatPkr(it.totalMinor)}</strong>
      </li>
    `
    )
    .join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>New Order Alert - GULNAAR by MK</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F1F1F1; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #222222;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding: 24px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.08); border: 1px solid #E0E0E0;">
          
          <!-- Alert Header Banner -->
          <tr>
            <td style="background-color: #18181B; padding: 24px 28px; border-bottom: 4px solid #D4AF37;">
              <span style="background-color: #B81D4E; color: #FFFFFF; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; padding: 3px 8px; border-radius: 4px;">
                🚨 NEW STORE ORDER
              </span>
              <h1 style="margin: 8px 0 0 0; color: #FFFFFF; font-size: 22px; font-weight: 700;">
                Order ${data.orderNumber} Received!
              </h1>
              <p style="margin: 4px 0 0 0; color: #D4AF37; font-size: 14px; font-weight: 600;">
                Total Amount: ${formattedTotal}
              </p>
            </td>
          </tr>

          <!-- Portal Direct Action Button -->
          <tr>
            <td style="padding: 24px 28px 16px 28px; text-align: center; background-color: #FFF9F0; border-bottom: 1px solid #F5E6CC;">
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #774400; font-weight: 600;">
                A customer has placed an order on the website. Click below to review in your Admin Portal:
              </p>
              <a href="${portalUrl}" target="_blank" style="display: inline-block; background-color: #B81D4E; color: #FFFFFF; font-size: 14px; font-weight: 800; text-decoration: none; padding: 14px 28px; border-radius: 8px; letter-spacing: 0.5px; box-shadow: 0 2px 8px rgba(184,29,78,0.3);">
                👉 Open Order in Admin Portal
              </a>
            </td>
          </tr>

          <!-- Customer & Delivery Snapshot -->
          <tr>
            <td style="padding: 24px 28px;">
              <h2 style="margin: 0 0 14px 0; font-size: 14px; text-transform: uppercase; color: #777777; letter-spacing: 1px;">
                Customer Information
              </h2>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size: 13px; line-height: 1.8;">
                <tr>
                  <td width="35%" style="color: #666666;">Customer Name:</td>
                  <td><strong>${data.customerName}</strong></td>
                </tr>
                <tr>
                  <td style="color: #666666;">Phone / WhatsApp:</td>
                  <td>
                    <strong style="color: #B81D4E; font-family: monospace;">${data.customerPhone}</strong>
                    &nbsp;
                    <a href="${whatsappUrl}" target="_blank" style="color: #25D366; text-decoration: none; font-weight: bold; font-size: 12px;">
                      [Chat on WhatsApp 💬]
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="color: #666666;">Email:</td>
                  <td>${data.customerEmail || '<em style="color: #999;">Not provided</em>'}</td>
                </tr>
                <tr>
                  <td style="color: #666666;">Delivery City:</td>
                  <td><strong>${data.city}</strong> (${data.province || 'Pakistan'})</td>
                </tr>
                <tr>
                  <td style="color: #666666;">Full Address:</td>
                  <td>${data.addressLine1}${data.addressLine2 ? `, ${data.addressLine2}` : ''}</td>
                </tr>
                <tr>
                  <td style="color: #666666;">Payment Method:</td>
                  <td>
                    <span style="background-color: #EEEEEE; padding: 2px 8px; border-radius: 4px; font-weight: bold; text-transform: uppercase; font-size: 11px;">
                      ${data.paymentMethod}
                    </span>
                  </td>
                </tr>
                ${data.paymentReference ? `
                <tr>
                  <td style="color: #666666;">Payment Ref / TRX ID:</td>
                  <td><strong style="font-family: monospace; color: #00704F; font-size: 14px;">${data.paymentReference}</strong></td>
                </tr>` : ''}
                ${data.specialInstructions ? `
                <tr>
                  <td style="color: #666666;">Special Instructions:</td>
                  <td style="font-style: italic; color: #444444;">${data.specialInstructions}</td>
                </tr>` : ''}
              </table>

              <!-- Ordered Items List -->
              <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #EEEEEE;">
                <h3 style="margin: 0 0 10px 0; font-size: 13px; text-transform: uppercase; color: #777777; letter-spacing: 0.5px;">
                  Ordered Items (${data.items.length})
                </h3>
                <ul style="margin: 0; padding-left: 20px;">
                  ${itemsList}
                </ul>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F8F8F8; padding: 18px 28px; text-align: center; border-top: 1px solid #EEEEEE; font-size: 11px; color: #888888;">
              <p style="margin: 0;">
                GULNAAR by MK Admin Alert System • <a href="${portalUrl}" style="color: #B81D4E; font-weight: bold;">Login to Admin Portal</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * 3. Send Both Order Emails
 * Safely dispatches via Resend API or SMTP without blocking/crashing checkout.
 */
export async function sendOrderEmails(data: SendOrderEmailsParams): Promise<{
  customerEmailSent: boolean;
  ownerEmailSent: boolean;
  errors?: string[];
}> {
  const errors: string[] = [];
  let customerEmailSent = false;
  let ownerEmailSent = false;

  const customerHtml = generateCustomerOrderEmailHtml(data);
  const ownerHtml = generateOwnerOrderAlertEmailHtml(data);

  // A. Determine Transporter: Resend or SMTP
  const resendApiKey = process.env.RESEND_API_KEY;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  // 1. Sending to Customer (only if customer provided an email address)
  if (data.customerEmail && data.customerEmail.includes('@')) {
    try {
      if (resendApiKey) {
        const { Resend } = await import('resend');
        const resend = new Resend(resendApiKey);
        await resend.emails.send({
          from: `${STORE_NAME} <${STORE_EMAIL}>`,
          to: data.customerEmail,
          subject: `✨ Your GULNAAR by MK Order ${data.orderNumber} is Confirmed!`,
          html: customerHtml,
        });
        customerEmailSent = true;
      } else if (smtpUser && smtpPass) {
        const nodemailer = (await import('nodemailer')).default;
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: Number(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_PORT === '465',
          auth: { user: smtpUser, pass: smtpPass },
        });
        await transporter.sendMail({
          from: `"${STORE_NAME}" <${STORE_EMAIL}>`,
          to: data.customerEmail,
          subject: `✨ Your GULNAAR by MK Order ${data.orderNumber} is Confirmed!`,
          html: customerHtml,
        });
        customerEmailSent = true;
      } else {
        // Fallback Mock Logger (Zero configuration mode)
        console.log(
          `[Email Dispatcher] Customer confirmation email simulated for ${data.customerEmail} (Order ${data.orderNumber})`
        );
        customerEmailSent = true;
      }
    } catch (err: any) {
      console.error('[Email Dispatcher Error - Customer]:', err.message);
      errors.push(`Customer email: ${err.message}`);
    }
  }

  // 2. Sending to Store Owner (Doctor Bilal Khan)
  try {
    const ownerSubject = `🚨 [NEW ORDER] ${data.orderNumber} — ${formatPkr(data.totalMinor)} from ${data.customerName} (${data.city})`;

    if (resendApiKey) {
      const { Resend } = await import('resend');
      const resend = new Resend(resendApiKey);
      await resend.emails.send({
        from: `${STORE_NAME} Alerts <${STORE_EMAIL}>`,
        to: OWNER_EMAIL,
        subject: ownerSubject,
        html: ownerHtml,
      });
      ownerEmailSent = true;
    } else if (smtpUser && smtpPass) {
      const nodemailer = (await import('nodemailer')).default;
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_PORT === '465',
        auth: { user: smtpUser, pass: smtpPass },
      });
      await transporter.sendMail({
        from: `"${STORE_NAME} Alerts" <${STORE_EMAIL}>`,
        to: OWNER_EMAIL,
        subject: ownerSubject,
        html: ownerHtml,
      });
      ownerEmailSent = true;
    } else {
      // Fallback Mock Logger (Zero configuration mode)
      console.log(
        `[Email Dispatcher] Owner notification alert simulated for ${OWNER_EMAIL} (Order ${data.orderNumber}): ${ownerSubject}`
      );
      ownerEmailSent = true;
    }
  } catch (err: any) {
    console.error('[Email Dispatcher Error - Owner]:', err.message);
    errors.push(`Owner email: ${err.message}`);
  }

  return { customerEmailSent, ownerEmailSent, errors };
}
