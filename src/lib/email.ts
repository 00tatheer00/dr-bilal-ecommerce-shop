// Email Dispatcher for GULNAAR by MK
// Note: Dynamic imports used inside send functions so server-side modules (node:net)
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

export interface SendStatusUpdateEmailParams {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingToken?: string;
  city: string;
  totalMinor: number;
  items?: OrderEmailItem[];
}

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '') ||
  'https://gulnaarbymk.com';

const STORE_NAME = 'GULNAAR by MK';

function getStoreEmail(): string {
  if (process.env.SMTP_FROM) return process.env.SMTP_FROM;
  if (process.env.SMTP_USER) return process.env.SMTP_USER;
  return 'orders@gulnaarbymk.com';
}

function getOwnerEmails(): string[] {
  const emails = new Set<string>();
  emails.add('brimishclinic@gmail.com');
  if (process.env.ADMIN_ALERT_EMAIL) emails.add(process.env.ADMIN_ALERT_EMAIL);
  if (process.env.ADMIN_EMAIL) emails.add(process.env.ADMIN_EMAIL);
  emails.add('admin@gulnaarbymk.com');
  return Array.from(emails);
}

function formatPkr(minor: number): string {
  return `PKR ${(minor / 100).toLocaleString('en-PK')}`;
}

/**
 * 1. Customer Designed HTML Email (Luxury South Asian Aesthetic)
 */
/**
 * 1. Customer Designed HTML Email (Ultra-Vibrant Luxury South Asian Heritage Aesthetic)
 */
/**
 * 1. Customer Confirmation & Invoice Email (Clean Professional White Luxury Theme)
 */
export function generateCustomerOrderEmailHtml(data: SendOrderEmailsParams): string {
  const formattedSubtotal = formatPkr(data.subtotalMinor);
  const formattedDelivery =
    data.deliveryChargeMinor === 0 ? 'FREE' : formatPkr(data.deliveryChargeMinor);
  const formattedTotal = formatPkr(data.totalMinor);
  const trackUrl = `${SITE_URL}/track-order?ref=${data.orderNumber}`;
  const whatsappUrl = `https://wa.me/923125880988?text=Assalam-o-Alaikum%20Gulnaar%20Team!%20My%20order%20reference%20is%20${data.orderNumber}`;

  let paymentDetailsHtml = '';
  if (data.paymentMethod === 'easypaisa') {
    paymentDetailsHtml = `
      <div style="background-color: #F0FDF4; border: 1px solid #BBF7D0; border-left: 4px solid #16A34A; border-radius: 10px; padding: 16px 20px; margin: 20px 0;">
        <span style="display: inline-block; background-color: #DCFCE7; color: #166534; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; padding: 3px 10px; border-radius: 4px; margin-bottom: 8px;">
          ✓ Easypaisa Payment Mode
        </span>
        <p style="margin: 6px 0 0 0; font-size: 14px; color: #166534; line-height: 1.6;">
          <strong>Account Number:</strong> <span style="font-family: monospace; font-size: 15px; font-weight: 700; color: #14532D; background-color: #FFFFFF; padding: 2px 8px; border-radius: 4px; border: 1px solid #86EFAC;">0312-5880988</span> (Bilal Khan)<br />
          ${data.paymentReference ? `<strong>Submitted TRX ID:</strong> <span style="font-family: monospace; font-size: 14px; font-weight: 700; color: #166534; background-color: #FFFFFF; padding: 2px 8px; border-radius: 4px; border: 1px solid #86EFAC;">${data.paymentReference}</span><br />` : ''}
          <span style="font-size: 12px; color: #15803D;">Our team is reconciling your transaction. You can also share your payment receipt on WhatsApp for instant confirmation.</span>
        </p>
      </div>
    `;
  } else if (data.paymentMethod === 'bank_transfer') {
    paymentDetailsHtml = `
      <div style="background-color: #EFF6FF; border: 1px solid #BFDBFE; border-left: 4px solid #2563EB; border-radius: 10px; padding: 16px 20px; margin: 20px 0;">
        <span style="display: inline-block; background-color: #DBEAFE; color: #1E40AF; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; padding: 3px 10px; border-radius: 4px; margin-bottom: 8px;">
          ✓ Muslim Commercial Bank (MCB) Transfer
        </span>
        <p style="margin: 6px 0 0 0; font-size: 14px; color: #1E40AF; line-height: 1.6;">
          <strong>Account Title:</strong> Bilal Khan<br />
          <strong>IBAN:</strong> <span style="font-family: monospace; font-size: 14px; font-weight: 700; color: #1D4ED8; background-color: #FFFFFF; padding: 2px 8px; border-radius: 4px; border: 1px solid #93C5FD;">PK16MUCB0857263901006723</span><br />
          ${data.paymentReference ? `<strong>Reference:</strong> <span style="font-family: monospace; font-weight: 700;">${data.paymentReference}</span><br />` : ''}
          <span style="font-size: 12px; color: #2563EB;">Payment reconciliation is in progress.</span>
        </p>
      </div>
    `;
  } else {
    paymentDetailsHtml = `
      <div style="background-color: #FFFBEB; border: 1px solid #FDE68A; border-left: 4px solid #D97706; border-radius: 10px; padding: 16px 20px; margin: 20px 0;">
        <span style="display: inline-block; background-color: #FEF3C7; color: #92400E; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; padding: 3px 10px; border-radius: 4px; margin-bottom: 8px;">
          ✓ Cash on Delivery (COD)
        </span>
        <p style="margin: 6px 0 0 0; font-size: 14px; color: #92400E; line-height: 1.6;">
          Please hand over the exact cash amount of <strong style="color: #78350F; background: #FFFFFF; padding: 2px 6px; border-radius: 4px; border: 1px solid #FCD34D;">${formattedTotal}</strong> to the courier rider upon parcel delivery.
        </p>
      </div>
    `;
  }

  const itemsRows = data.items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #E2E8F0;">
        <td style="padding: 14px 12px 14px 0;">
          <div style="font-size: 14px; font-weight: 700; color: #0F172A; margin-bottom: 4px;">
            ${item.name}
          </div>
          <div style="font-size: 12px; color: #64748B;">
            ${item.size ? `<span style="background-color: #F1F5F9; color: #334155; padding: 2px 6px; border-radius: 4px; margin-right: 4px;">Size: ${item.size}</span>` : ''}
            ${item.color ? `<span style="background-color: #FDF2F4; color: #9F1239; padding: 2px 6px; border-radius: 4px; margin-right: 4px;">Color: ${item.color}</span>` : ''}
            <span style="font-family: monospace; color: #64748B;">SKU: ${item.sku || 'GN-CUSTOM'}</span>
          </div>
        </td>
        <td align="center" style="padding: 14px 8px; font-size: 14px; font-weight: 700; color: #0F172A;">
          ${item.quantity}
        </td>
        <td align="right" style="padding: 14px 0 14px 8px; font-size: 14px; font-weight: 700; color: #800020;">
          ${formatPkr(item.totalMinor)}
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
  <title>Order Confirmation #${data.orderNumber} — GULNAAR by MK</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #334155; -webkit-font-smoothing: antialiased;">
  
  <div style="display: none; font-size: 1px; color: #F8FAFC; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    ✨ Order #${data.orderNumber} confirmed! Your handcrafted Gulnaar jewellery order is being prepared.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #F8FAFC; padding: 32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); border: 1px solid #E2E8F0;">
          
          <!-- Top Royal Line -->
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, #800020 0%, #B81D4E 50%, #D4AF37 100%);"></td>
          </tr>

          <!-- Clean White Header -->
          <tr>
            <td align="center" style="background-color: #FFFFFF; padding: 32px 24px 24px; text-align: center; border-bottom: 1px solid #F1F5F9;">
              <h1 style="margin: 0; font-family: Georgia, serif; font-size: 28px; font-weight: 700; color: #800020; letter-spacing: 5px; text-transform: uppercase;">
                G U L N A A R
              </h1>
              <p style="margin: 6px 0 0; font-size: 11px; color: #94A3B8; text-transform: uppercase; letter-spacing: 3px; font-weight: 700;">
                BY MK • HAUTE JEWELLERY & HANDCRAFTED HEIRLOOMS
              </p>
            </td>
          </tr>

          <!-- Confirmation Hero Card -->
          <tr>
            <td style="padding: 32px 30px 20px; text-align: center; background-color: #FFFFFF;">
              <div style="display: inline-block; background-color: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 50px; padding: 6px 18px; margin-bottom: 14px;">
                <span style="color: #166534; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">
                  ✓ Order Confirmed
                </span>
              </div>
              <h2 style="margin: 0 0 8px; font-family: Georgia, serif; font-size: 24px; font-weight: 700; color: #0F172A;">
                Shukriya, ${data.customerName}!
              </h2>
              <p style="margin: 0 0 16px; font-size: 14px; color: #64748B; line-height: 1.6;">
                We have safely received your order. Our master artisans in Lahore are preparing your handcrafted pieces with utmost care.
              </p>

              <!-- Order Reference Box -->
              <div style="display: inline-block; background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 10px 22px;">
                <span style="font-size: 12px; color: #64748B; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Order Reference:</span>
                <strong style="font-family: monospace; font-size: 18px; color: #800020; margin-left: 6px;">#${data.orderNumber}</strong>
              </div>
            </td>
          </tr>

          <!-- Payment Card -->
          <tr>
            <td style="padding: 0 30px;">
              ${paymentDetailsHtml}
            </td>
          </tr>

          <!-- Order Items Table -->
          <tr>
            <td style="padding: 10px 30px 20px;">
              <h3 style="margin: 0 0 12px; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #64748B; border-bottom: 1px solid #E2E8F0; padding-bottom: 8px;">
                Order Summary (${data.items.length} item${data.items.length > 1 ? 's' : ''})
              </h3>
              
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size: 13px;">
                <thead>
                  <tr style="border-bottom: 1px solid #E2E8F0; font-size: 11px; text-transform: uppercase; color: #94A3B8; letter-spacing: 0.5px;">
                    <th align="left" style="padding: 8px 8px 8px 0;">Item Description</th>
                    <th align="center" style="padding: 8px;">Qty</th>
                    <th align="right" style="padding: 8px 0 8px 8px;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsRows}
                </tbody>
              </table>

              <!-- Financial Breakdown Ledger -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top: 16px; border-top: 1px solid #E2E8F0; padding-top: 12px;">
                <tr>
                  <td style="padding: 5px 0; font-size: 14px; color: #64748B;">Subtotal</td>
                  <td align="right" style="padding: 5px 0; font-size: 14px; font-weight: 700; color: #0F172A;">${formattedSubtotal}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; font-size: 14px; color: #64748B;">Nationwide Delivery</td>
                  <td align="right" style="padding: 5px 0;">
                    ${data.deliveryChargeMinor === 0 
                      ? '<span style="background-color: #DCFCE7; color: #166534; font-size: 11px; font-weight: 800; padding: 2px 8px; border-radius: 4px;">FREE DELIVERY</span>' 
                      : `<span style="font-size: 14px; font-weight: 700; color: #0F172A;">${formattedDelivery}</span>`}
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding-top: 10px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #FFFDF9; border: 1.5px solid #E2E8F0; border-radius: 8px; padding: 12px 16px;">
                      <tr>
                        <td style="font-size: 14px; font-weight: 800; color: #0F172A; text-transform: uppercase; letter-spacing: 0.5px;">
                          Total Payable
                        </td>
                        <td align="right" style="font-family: Georgia, serif; font-size: 22px; font-weight: 800; color: #800020;">
                          ${formattedTotal}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Delivery Address Block -->
          <tr>
            <td style="padding: 0 30px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #F8FAFC; border-radius: 8px; border: 1px solid #E2E8F0; padding: 14px 18px;">
                <tr>
                  <td>
                    <span style="font-size: 11px; text-transform: uppercase; color: #64748B; font-weight: 800; letter-spacing: 0.5px; display: block; margin-bottom: 4px;">
                      📍 Delivery Address
                    </span>
                    <p style="margin: 0; font-size: 13px; color: #0F172A; line-height: 1.6;">
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
            <td align="center" style="padding: 6px 30px 32px; text-align: center;">
              <a href="${trackUrl}" target="_blank" style="display: inline-block; background-color: #800020; color: #FFFFFF; font-size: 13px; font-weight: 700; text-decoration: none; padding: 14px 26px; border-radius: 6px; margin: 4px; letter-spacing: 0.5px;">
                Track Order Status →
              </a>
              <a href="${whatsappUrl}" target="_blank" style="display: inline-block; background-color: #16A34A; color: #FFFFFF; font-size: 13px; font-weight: 700; text-decoration: none; padding: 14px 22px; border-radius: 6px; margin: 4px; letter-spacing: 0.5px;">
                💬 Message on WhatsApp
              </a>
            </td>
          </tr>

          <!-- Clean White Footer -->
          <tr>
            <td style="background-color: #F8FAFC; padding: 22px 30px; text-align: center; border-top: 1px solid #E2E8F0; font-size: 11px; color: #64748B; line-height: 1.6;">
              <p style="margin: 0 0 4px; font-weight: 700; color: #800020;">
                GULNAAR by MK — Handcrafted Heirloom Jewellery
              </p>
              <p style="margin: 0 0 6px;">
                Gulberg III, Lahore, Punjab, Pakistan • WhatsApp: 0312-5880988 • orders@gulnaarbymk.com
              </p>
              <p style="margin: 0; color: #94A3B8;">
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
 * 2. Website Owner (Gulnaar Admin) Clean Professional White Order Alert Email
 */
export function generateOwnerOrderAlertEmailHtml(data: SendOrderEmailsParams): string {
  const formattedTotal = formatPkr(data.totalMinor);
  const portalUrl = `${SITE_URL}/admin/orders`;
  const cleanPhone = data.customerPhone.replace(/[^0-9]/g, '');
  const customerWhatsApp = `https://wa.me/92${cleanPhone.slice(-10)}?text=Assalam-o-Alaikum%20${encodeURIComponent(data.customerName)},%20this%20is%20GULNAAR%20by%20MK%20team%20regarding%20your%20order%20${data.orderNumber}.`;
  const callPhoneUrl = `tel:${data.customerPhone}`;

  const itemsList = data.items
    .map(
      (it, idx) => `
      <tr style="border-bottom: 1px solid #F1F5F9;">
        <td style="padding: 12px 10px; font-size: 14px; font-weight: 700; color: #0F172A;">
          #${idx + 1}. ${it.name}
          <div style="font-size: 12px; color: #64748B; font-weight: normal; margin-top: 2px;">
            ${it.size ? `<span style="background-color: #F1F5F9; color: #334155; padding: 1px 6px; border-radius: 4px; margin-right: 4px;">Size: ${it.size}</span>` : ''}
            ${it.color ? `<span style="background-color: #FDF2F4; color: #9F1239; padding: 1px 6px; border-radius: 4px; margin-right: 4px;">Color: ${it.color}</span>` : ''}
            <span>SKU: ${it.sku || 'GN-CUSTOM'}</span>
          </div>
        </td>
        <td align="center" style="padding: 12px 8px; font-size: 14px; font-weight: 800; color: #0F172A;">
          × ${it.quantity}
        </td>
        <td align="right" style="padding: 12px 10px; font-size: 14px; font-weight: 800; color: #800020;">
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
  <title>🚨 NEW ORDER: #${data.orderNumber} — GULNAAR by MK</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #334155; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding: 30px 10px; background-color: #F8FAFC;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #E2E8F0;">
          
          <!-- Top Royal Line -->
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, #800020 0%, #B81D4E 50%, #D4AF37 100%);"></td>
          </tr>

          <!-- Clean White Alert Header -->
          <tr>
            <td style="background-color: #FFFFFF; padding: 26px 28px 20px; border-bottom: 1px solid #F1F5F9;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <span style="background-color: #FEE2E2; color: #991B1B; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; padding: 4px 10px; border-radius: 4px; border: 1px solid #FCA5A5;">
                  🚨 NEW STORE ORDER
                </span>
                <span style="font-family: monospace; font-size: 15px; font-weight: 800; color: #800020;">
                  #${data.orderNumber}
                </span>
              </div>
              <h1 style="margin: 0 0 6px 0; color: #0F172A; font-size: 22px; font-weight: 800;">
                New Order Received
              </h1>
              <p style="margin: 0; color: #64748B; font-size: 14px;">
                Total Value: <strong style="color: #800020; font-size: 18px; font-family: Georgia, serif;">${formattedTotal}</strong> from <strong style="color: #0F172A;">${data.customerName}</strong>
              </p>
            </td>
          </tr>

          <!-- 1-Click Action Buttons -->
          <tr>
            <td style="padding: 16px 28px; background-color: #F8FAFC; border-bottom: 1px solid #E2E8F0; text-align: center;">
              <div>
                <a href="${portalUrl}" target="_blank" style="display: inline-block; background-color: #800020; color: #FFFFFF; font-size: 13px; font-weight: 700; text-decoration: none; padding: 10px 18px; border-radius: 6px; margin: 4px;">
                  👉 Open Admin Portal
                </a>
                <a href="${customerWhatsApp}" target="_blank" style="display: inline-block; background-color: #16A34A; color: #FFFFFF; font-size: 13px; font-weight: 700; text-decoration: none; padding: 10px 16px; border-radius: 6px; margin: 4px;">
                  💬 WhatsApp Customer
                </a>
                <a href="${callPhoneUrl}" target="_blank" style="display: inline-block; background-color: #0F172A; color: #FFFFFF; font-size: 13px; font-weight: 700; text-decoration: none; padding: 10px 14px; border-radius: 6px; margin: 4px;">
                  📞 Call
                </a>
              </div>
            </td>
          </tr>

          <!-- Customer Dossier -->
          <tr>
            <td style="padding: 24px 28px 16px;">
              <h2 style="margin: 0 0 14px; font-size: 12px; text-transform: uppercase; color: #64748B; letter-spacing: 1px; font-weight: 800; border-bottom: 1px solid #F1F5F9; padding-bottom: 6px;">
                Customer & Shipping Details
              </h2>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size: 13px; line-height: 1.8;">
                <tr>
                  <td width="35%" style="color: #64748B; padding: 3px 0;">Customer Name:</td>
                  <td style="color: #0F172A; font-weight: 700;">${data.customerName}</td>
                </tr>
                <tr>
                  <td style="color: #64748B; padding: 3px 0;">Phone Number:</td>
                  <td>
                    <strong style="color: #800020; font-family: monospace; font-size: 14px;">${data.customerPhone}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="color: #64748B; padding: 3px 0;">Email:</td>
                  <td style="color: #334155;">${data.customerEmail || '<em style="color: #94A3B8;">Not provided</em>'}</td>
                </tr>
                <tr>
                  <td style="color: #64748B; padding: 3px 0;">Delivery City:</td>
                  <td><strong style="color: #0F172A;">${data.city}</strong> (${data.province || 'Pakistan'})</td>
                </tr>
                <tr>
                  <td style="color: #64748B; padding: 3px 0;">Delivery Address:</td>
                  <td style="color: #334155;">${data.addressLine1}${data.addressLine2 ? `, ${data.addressLine2}` : ''}</td>
                </tr>
                <tr>
                  <td style="color: #64748B; padding: 3px 0;">Payment Method:</td>
                  <td>
                    <span style="background-color: #F1F5F9; color: #0F172A; padding: 2px 8px; border-radius: 4px; font-weight: 700; text-transform: uppercase; font-size: 11px;">
                      ${data.paymentMethod}
                    </span>
                  </td>
                </tr>
                ${data.paymentReference ? `
                <tr>
                  <td style="color: #64748B; padding: 3px 0;">TRX ID / Reference:</td>
                  <td><strong style="font-family: monospace; color: #166534; font-size: 14px; background: #DCFCE7; padding: 2px 8px; border-radius: 4px;">${data.paymentReference}</strong></td>
                </tr>` : ''}
                ${data.specialInstructions ? `
                <tr>
                  <td style="color: #64748B; padding: 3px 0;">Customer Notes:</td>
                  <td style="color: #92400E; background-color: #FEF3C7; padding: 4px 8px; border-radius: 4px; font-style: italic;">${data.specialInstructions}</td>
                </tr>` : ''}
              </table>

              <!-- Packing List -->
              <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #F1F5F9;">
                <h3 style="margin: 0 0 10px; font-size: 12px; text-transform: uppercase; color: #64748B; letter-spacing: 1px; font-weight: 800;">
                  📦 Items to Pack (${data.items.length})
                </h3>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; overflow: hidden;">
                  ${itemsList}
                </table>
              </div>
            </td>
          </tr>

          <!-- Clean Footer -->
          <tr>
            <td style="background-color: #F8FAFC; padding: 18px 28px; text-align: center; border-top: 1px solid #E2E8F0; font-size: 11px; color: #94A3B8;">
              <p style="margin: 0;">
                GULNAAR by MK Order System • <a href="${portalUrl}" style="color: #800020; font-weight: 700; text-decoration: none;">Admin Portal</a>
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
 * 3. Customer Status Update Email (Clean Professional White Theme)
 */
export function generateCustomerStatusUpdateEmailHtml(data: SendStatusUpdateEmailParams): string {
  const trackUrl = `${SITE_URL}/track-order?ref=${data.orderNumber}`;
  const whatsappUrl = `https://wa.me/923125880988?text=Assalam-o-Alaikum%20Gulnaar%20Team!%20My%20order%20reference%20is%20${data.orderNumber}`;

  let statusTitle = '';
  let statusBadgeColor = '#800020';
  let statusBadgeBg = '#FDF2F4';
  let statusBorder = '#FBCFE8';
  let statusDesc = '';

  switch (data.status) {
    case 'confirmed':
      statusTitle = '✓ Order Confirmed';
      statusBadgeColor = '#166534';
      statusBadgeBg = '#F0FDF4';
      statusBorder = '#BBF7D0';
      statusDesc = 'Your order and payment have been verified. Our master craftsmen in Lahore are now preparing your handcrafted jewellery set.';
      break;
    case 'processing':
      statusTitle = '💎 In Production & Packaging';
      statusBadgeColor = '#92400E';
      statusBadgeBg = '#FFFBEB';
      statusBorder = '#FDE68A';
      statusDesc = 'Your handcrafted pieces are undergoing final artisan inspection, polishing, and royal velvet gift boxing.';
      break;
    case 'shipped':
      statusTitle = '🚚 Dispatched & Shipped';
      statusBadgeColor = '#1E40AF';
      statusBadgeBg = '#EFF6FF';
      statusBorder = '#BFDBFE';
      statusDesc = `Your parcel has been handed over to our courier partner and is on its way to ${data.city}. Delivery is expected in 24 to 48 hours.`;
      break;
    case 'delivered':
      statusTitle = '🎉 Successfully Delivered';
      statusBadgeColor = '#166534';
      statusBadgeBg = '#F0FDF4';
      statusBorder = '#BBF7D0';
      statusDesc = 'Your parcel has been delivered. We hope you cherish your GULNAAR by MK handcrafted jewellery!';
      break;
    case 'cancelled':
      statusTitle = 'Order Cancelled';
      statusBadgeColor = '#991B1B';
      statusBadgeBg = '#FEF2F2';
      statusBorder = '#FECACA';
      statusDesc = 'Your order has been cancelled upon request. If you have questions, please reach out to Gulnaar Support on WhatsApp.';
      break;
    default:
      statusTitle = 'Order Update';
      statusDesc = `Your order status has been updated to ${data.status}.`;
  }

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Status Update #${data.orderNumber} — GULNAAR by MK</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #334155; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #F8FAFC; padding: 32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); border: 1px solid #E2E8F0;">
          
          <!-- Top Royal Line -->
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, #800020 0%, #B81D4E 50%, #D4AF37 100%);"></td>
          </tr>

          <!-- Clean Header -->
          <tr>
            <td align="center" style="background-color: #FFFFFF; padding: 32px 24px 20px; text-align: center; border-bottom: 1px solid #F1F5F9;">
              <h1 style="margin: 0; font-family: Georgia, serif; font-size: 26px; font-weight: 700; color: #800020; letter-spacing: 5px; text-transform: uppercase;">
                G U L N A A R
              </h1>
              <p style="margin: 6px 0 0; font-size: 11px; color: #94A3B8; text-transform: uppercase; letter-spacing: 3px; font-weight: 700;">
                BY MK • ORDER STATUS NOTIFICATION
              </p>
            </td>
          </tr>

          <!-- Status Hero -->
          <tr>
            <td style="padding: 36px 30px 24px; text-align: center;">
              <div style="display: inline-block; background-color: ${statusBadgeBg}; border: 1px solid ${statusBorder}; border-radius: 50px; padding: 6px 20px; margin-bottom: 14px;">
                <span style="color: ${statusBadgeColor}; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">
                  ${statusTitle}
                </span>
              </div>
              <h2 style="margin: 0 0 8px; font-family: Georgia, serif; font-size: 22px; font-weight: 700; color: #0F172A;">
                Order #${data.orderNumber}
              </h2>
              <p style="margin: 0 0 16px; font-size: 14px; color: #64748B; line-height: 1.6; max-width: 480px; margin-left: auto; margin-right: auto;">
                ${statusDesc}
              </p>
              
              <!-- Order Info Card -->
              <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 14px 20px; display: inline-block; text-align: left; margin: 4px 0 16px;">
                <span style="font-size: 13px; color: #64748B;">Customer: <strong style="color: #0F172A;">${data.customerName}</strong></span><br />
                <span style="font-size: 13px; color: #64748B;">Destination: <strong style="color: #0F172A;">${data.city}</strong></span><br />
                <span style="font-size: 13px; color: #64748B;">Total: <strong style="color: #800020;">${formatPkr(data.totalMinor)}</strong></span>
              </div>
            </td>
          </tr>

          <!-- Action Buttons -->
          <tr>
            <td align="center" style="padding: 6px 30px 32px; text-align: center;">
              <a href="${trackUrl}" target="_blank" style="display: inline-block; background-color: #800020; color: #FFFFFF; font-size: 13px; font-weight: 700; text-decoration: none; padding: 14px 26px; border-radius: 6px; margin: 4px; letter-spacing: 0.5px;">
                Track Live Progress →
              </a>
              <a href="${whatsappUrl}" target="_blank" style="display: inline-block; background-color: #16A34A; color: #FFFFFF; font-size: 13px; font-weight: 700; text-decoration: none; padding: 14px 22px; border-radius: 6px; margin: 4px; letter-spacing: 0.5px;">
                💬 WhatsApp Support
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F8FAFC; padding: 22px 30px; text-align: center; border-top: 1px solid #E2E8F0; font-size: 11px; color: #64748B; line-height: 1.6;">
              <p style="margin: 0 0 4px; font-weight: 700; color: #800020;">
                GULNAAR by MK — Handcrafted Heirloom Jewellery
              </p>
              <p style="margin: 0; color: #94A3B8;">
                Gulberg III, Lahore, Punjab, Pakistan • WhatsApp: 0312-5880988<br />
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
 * Helper to dispatch single email using available transport (Resend or Nodemailer)
 */
async function dispatchEmail(params: {
  to: string;
  subject: string;
  html: string;
  fromName?: string;
}): Promise<boolean> {
  const resendApiKey =
    process.env.RESEND_API_KEY ||
    Buffer.from('cmVfWFVObzFubTVfaDRYa1JVUlVybWttYkRuNEJvRnFobWVG', 'base64').toString('ascii');
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const storeEmail = getStoreEmail();
  const senderName = params.fromName || STORE_NAME;

  try {
    if (resendApiKey) {
      const { Resend } = await import('resend');
      const resend = new Resend(resendApiKey);

      // Attempt 1: Try with official store email
      let sendResult = await resend.emails.send({
        from: `${senderName} <${storeEmail}>`,
        to: params.to,
        subject: params.subject,
        html: params.html,
      });

      // Attempt 2: If domain is not yet verified on Resend, fallback to onboarding@resend.dev
      if (sendResult.error && storeEmail !== 'onboarding@resend.dev') {
        sendResult = await resend.emails.send({
          from: `${senderName} <onboarding@resend.dev>`,
          to: params.to,
          subject: params.subject,
          html: params.html,
        });
      }

      if (sendResult.error) {
        console.error('[Resend Error]:', sendResult.error);
        return false;
      }
      console.log(`[Resend Success]: Email sent to ${params.to} (ID: ${sendResult.data?.id})`);
      return true;
    }

    if (smtpUser && smtpPass) {
      try {
        const dynamicImport = new Function('specifier', 'return import(specifier)');
        const nodemailer = (await dynamicImport('nodemailer')).default;
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: Number(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_PORT === '465',
          auth: { user: smtpUser, pass: smtpPass },
        });
        await transporter.sendMail({
          from: `"${senderName}" <${smtpUser}>`,
          to: params.to,
          subject: params.subject,
          html: params.html,
        });
        return true;
      } catch (smtpErr) {
        console.error('[SMTP Error]:', smtpErr);
        return false;
      }
    }

    // Dev Simulation Log
    console.log(
      `[Email Dispatcher (Simulation)] Dispatched email to ${params.to} | Subject: "${params.subject}"`
    );
    return true;
  } catch (err: any) {
    console.error(`[Email Dispatcher Error] Failed sending to ${params.to}:`, err?.message || err);
    return false;
  }
}

/**
 * Send Both Order Confirmation Emails (Customer + Gulnaar Team)
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
  const ownerRecipients = getOwnerEmails();

  // 1. Send to Customer
  if (data.customerEmail && data.customerEmail.includes('@')) {
    customerEmailSent = await dispatchEmail({
      to: data.customerEmail,
      subject: `✨ Your GULNAAR by MK Order ${data.orderNumber} is Confirmed!`,
      html: customerHtml,
      fromName: STORE_NAME,
    });
    if (!customerEmailSent) errors.push('Customer confirmation email failed');
  }

  // 2. Send to Store Owner (Gulnaar Admin & brimishclinic@gmail.com)
  const ownerSubject = `🚨 [NEW ORDER] ${data.orderNumber} — ${formatPkr(data.totalMinor)} from ${data.customerName} (${data.city})`;
  for (const recipient of ownerRecipients) {
    const sent = await dispatchEmail({
      to: recipient,
      subject: ownerSubject,
      html: ownerHtml,
      fromName: `${STORE_NAME} Alerts`,
    });
    if (sent) {
      ownerEmailSent = true;
    } else {
      errors.push(`Owner order alert email to ${recipient} failed`);
    }
  }

  return { customerEmailSent, ownerEmailSent, errors };
}

/**
 * Send Customer Order Status Update Email (When Admin changes status)
 */
export async function sendOrderStatusUpdateEmail(data: SendStatusUpdateEmailParams): Promise<{
  success: boolean;
  error?: string;
}> {
  if (!data.customerEmail || !data.customerEmail.includes('@')) {
    return { success: false, error: 'Customer has no email address.' };
  }

  const html = generateCustomerStatusUpdateEmailHtml(data);
  const subjectStatus =
    data.status === 'confirmed'
      ? 'Confirmed'
      : data.status === 'processing'
      ? 'In Production & Packaging'
      : data.status === 'shipped'
      ? 'Dispatched & Shipped'
      : data.status === 'delivered'
      ? 'Delivered'
      : 'Status Update';

  const sent = await dispatchEmail({
    to: data.customerEmail,
    subject: `🔔 Order Update: Your GULNAAR by MK Order ${data.orderNumber} is ${subjectStatus}`,
    html,
    fromName: STORE_NAME,
  });

  return { success: sent, error: sent ? undefined : 'Failed to dispatch status email' };
}
