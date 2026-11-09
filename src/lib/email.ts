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
      <div style="background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%); border: 1.5px solid #059669; border-radius: 12px; padding: 18px 20px; margin: 22px 0; box-shadow: 0 4px 12px rgba(5,150,105,0.08);">
        <div style="display: flex; align-items: center; margin-bottom: 8px;">
          <span style="background-color: #059669; color: #FFFFFF; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; padding: 4px 10px; border-radius: 50px;">
            ✓ Easypaisa Payment Mode
          </span>
        </div>
        <p style="margin: 8px 0 0 0; font-size: 14px; color: #064E3B; line-height: 1.6;">
          <strong>Account Number:</strong> <span style="font-family: monospace; font-size: 15px; font-weight: bold; color: #047857; background: #FFFFFF; padding: 2px 8px; border-radius: 6px; border: 1px solid #A7F3D0;">0312-5880988</span> (Bilal Khan)<br />
          ${data.paymentReference ? `<strong>Submitted TRX ID:</strong> <span style="font-family: monospace; font-size: 15px; font-weight: bold; color: #065F46; background: #FEF3C7; padding: 2px 8px; border-radius: 6px; border: 1px solid #FCD34D;">${data.paymentReference}</span><br />` : ''}
          <span style="font-size: 12px; color: #047857;">Our finance team is verifying your payment. You can also send your payment receipt screenshot on WhatsApp for instant confirmation.</span>
        </p>
      </div>
    `;
  } else if (data.paymentMethod === 'bank_transfer') {
    paymentDetailsHtml = `
      <div style="background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%); border: 1.5px solid #2563EB; border-radius: 12px; padding: 18px 20px; margin: 22px 0; box-shadow: 0 4px 12px rgba(37,99,235,0.08);">
        <div style="margin-bottom: 8px;">
          <span style="background-color: #1E40AF; color: #FFFFFF; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; padding: 4px 10px; border-radius: 50px;">
            ✓ Muslim Commercial Bank (MCB) Transfer
          </span>
        </div>
        <p style="margin: 8px 0 0 0; font-size: 14px; color: #1E3A8A; line-height: 1.6;">
          <strong>Account Title:</strong> Bilal Khan<br />
          <strong>IBAN:</strong> <span style="font-family: monospace; font-size: 14px; font-weight: bold; color: #1D4ED8; background: #FFFFFF; padding: 3px 8px; border-radius: 6px; border: 1px solid #BFDBFE;">PK16MUCB0857263901006723</span><br />
          ${data.paymentReference ? `<strong>Reference / Sender:</strong> <span style="font-family: monospace; font-weight: bold; color: #1E40AF;">${data.paymentReference}</span><br />` : ''}
          <span style="font-size: 12px; color: #3B82F6;">Payment reconciliation is in progress.</span>
        </p>
      </div>
    `;
  } else {
    paymentDetailsHtml = `
      <div style="background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%); border: 1.5px solid #F59E0B; border-radius: 12px; padding: 18px 20px; margin: 22px 0; box-shadow: 0 4px 12px rgba(245,158,11,0.08);">
        <div style="margin-bottom: 8px;">
          <span style="background: linear-gradient(135deg, #D97706 0%, #B45309 100%); color: #FFFFFF; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; padding: 4px 10px; border-radius: 50px;">
            ✓ Cash on Delivery (COD)
          </span>
        </div>
        <p style="margin: 8px 0 0 0; font-size: 14px; color: #92400E; line-height: 1.6;">
          Please keep the exact amount of <strong style="font-size: 16px; color: #78350F; background: #FFFFFF; padding: 2px 8px; border-radius: 6px; border: 1px solid #FDE68A;">${formattedTotal}</strong> ready in cash upon doorstep arrival. Our courier will contact you before delivery.
        </p>
      </div>
    `;
  }

  const itemsRows = data.items
    .map(
      (item, index) => `
      <tr style="border-bottom: 1px solid #F3EDE2;">
        <td style="padding: 16px 12px 16px 0;">
          <div style="font-size: 15px; font-weight: 700; color: #1C1917; margin-bottom: 4px;">
            ${item.name}
          </div>
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            ${item.size ? `<span style="display: inline-block; background-color: #F5EFEB; color: #800020; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 4px; border: 1px solid #EADBCE; margin-right: 4px;">Size: ${item.size}</span>` : ''}
            ${item.color ? `<span style="display: inline-block; background-color: #FDF2F4; color: #9F1239; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 4px; border: 1px solid #FBCFE8; margin-right: 4px;">Color: ${item.color}</span>` : ''}
            <span style="display: inline-block; background-color: #F4F4F5; color: #52525B; font-size: 11px; font-family: monospace; padding: 2px 8px; border-radius: 4px;">SKU: ${item.sku || 'GN-CUSTOM'}</span>
          </div>
        </td>
        <td align="center" style="padding: 16px 8px; font-size: 14px; font-weight: 700; color: #44403C;">
          <span style="display: inline-block; background-color: #FAF5EB; border: 1px solid #D4AF37; color: #800020; border-radius: 50%; width: 28px; height: 28px; line-height: 28px; text-align: center;">
            ${item.quantity}
          </span>
        </td>
        <td align="right" style="padding: 16px 0 16px 8px; font-size: 15px; font-weight: 800; color: #800020;">
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
<body style="margin: 0; padding: 0; background-color: #F7F3EB; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #292524; -webkit-font-smoothing: antialiased;">
  
  <!-- Preheader text for inbox preview -->
  <div style="display: none; font-size: 1px; color: #F7F3EB; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    ✨ Order #${data.orderNumber} confirmed! Your handcrafted Gulnaar heirloom jewellery is now being prepared in our atelier.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #F7F3EB; padding: 36px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 620px; background-color: #FFFFFF; border-radius: 20px; overflow: hidden; box-shadow: 0 16px 48px rgba(128, 0, 32, 0.12), 0 2px 8px rgba(0,0,0,0.04); border: 2px solid #EADBCE;">
          
          <!-- Golden Royal Accent Top Line -->
          <tr>
            <td style="height: 6px; background: linear-gradient(90deg, #D4AF37 0%, #FFF3B0 25%, #E5A93C 50%, #FFF3B0 75%, #D4AF37 100%);"></td>
          </tr>

          <!-- Imperial Brand Header -->
          <tr>
            <td align="center" style="background: linear-gradient(135deg, #3A0211 0%, #68051E 40%, #800020 75%, #A31238 100%); padding: 40px 24px 34px 24px; text-align: center; border-bottom: 2px solid #D4AF37;">
              <div style="margin-bottom: 10px;">
                <span style="display: inline-block; background: rgba(212, 175, 55, 0.18); border: 1px solid rgba(212, 175, 55, 0.5); padding: 4px 16px; border-radius: 50px; color: #FDF4E3; font-size: 11px; letter-spacing: 3px; font-weight: 700; text-transform: uppercase;">
                  👑 ROYAL HERITAGE ATELIER
                </span>
              </div>
              <h1 style="margin: 0; font-family: Georgia, 'Playfair Display', serif; font-size: 36px; font-weight: 700; color: #FFFFFF; letter-spacing: 7px; text-transform: uppercase; text-shadow: 0 2px 12px rgba(0,0,0,0.35);">
                G U L N A A R
              </h1>
              <p style="margin: 8px 0 0 0; font-size: 11px; color: #F5E6CC; text-transform: uppercase; letter-spacing: 4px; font-weight: 700;">
                BY MK • HAUTE JEWELLERY & HANDCRAFTED HEIRLOOMS
              </p>
            </td>
          </tr>

          <!-- Celebration Hero & Greeting -->
          <tr>
            <td style="padding: 36px 32px 24px 32px; text-align: center; background: radial-gradient(circle at 50% 0%, #FFFBF5 0%, #FFFFFF 100%);">
              <div style="display: inline-block; background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%); border: 1.5px solid #10B981; border-radius: 50px; padding: 6px 20px; margin-bottom: 16px; box-shadow: 0 2px 8px rgba(16,185,129,0.15);">
                <span style="color: #065F46; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px;">
                  ✨ Order Commissioned & Confirmed
                </span>
              </div>
              <h2 style="margin: 0 0 10px 0; font-family: Georgia, serif; font-size: 26px; font-weight: 700; color: #1C1917;">
                Shukriya, ${data.customerName}!
              </h2>
              <p style="margin: 0 0 16px 0; font-size: 15px; color: #57534E; line-height: 1.6; max-width: 500px; margin-left: auto; margin-right: auto;">
                We have safely received your order. Our master artisans in Lahore are preparing your handcrafted jewellery with royal craftsmanship.
              </p>

              <!-- Order Reference Box -->
              <div style="display: inline-block; background: #FAF5EB; border: 1.5px dashed #D4AF37; border-radius: 12px; padding: 12px 28px; margin: 6px 0 12px 0;">
                <span style="display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #78716C; font-weight: 700;">Order Reference</span>
                <span style="font-family: monospace; font-size: 22px; font-weight: 800; color: #800020; letter-spacing: 2px;">#${data.orderNumber}</span>
              </div>
            </td>
          </tr>

          <!-- Visual Order Stepper (Progress Bar) -->
          <tr>
            <td style="padding: 0 32px 24px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #FAF7F2; border-radius: 12px; border: 1px solid #EADBCE; padding: 14px 12px; text-align: center;">
                <tr>
                  <td width="25%" align="center">
                    <span style="display: block; width: 28px; height: 28px; border-radius: 50%; background: #059669; color: #FFF; line-height: 28px; font-size: 13px; font-weight: bold; margin: 0 auto 4px;">✓</span>
                    <span style="font-size: 11px; font-weight: 800; color: #065F46;">Placed</span>
                  </td>
                  <td width="25%" align="center">
                    <span style="display: block; width: 28px; height: 28px; border-radius: 50%; background: #D97706; color: #FFF; line-height: 28px; font-size: 13px; font-weight: bold; margin: 0 auto 4px;">💎</span>
                    <span style="font-size: 11px; font-weight: 800; color: #92400E;">Crafting</span>
                  </td>
                  <td width="25%" align="center">
                    <span style="display: block; width: 28px; height: 28px; border-radius: 50%; background: #E7E5E4; color: #78716C; line-height: 28px; font-size: 13px; font-weight: bold; margin: 0 auto 4px;">🔍</span>
                    <span style="font-size: 11px; font-weight: 700; color: #78716C;">Quality</span>
                  </td>
                  <td width="25%" align="center">
                    <span style="display: block; width: 28px; height: 28px; border-radius: 50%; background: #E7E5E4; color: #78716C; line-height: 28px; font-size: 13px; font-weight: bold; margin: 0 auto 4px;">🚚</span>
                    <span style="font-size: 11px; font-weight: 700; color: #78716C;">Dispatched</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Payment Mode Card -->
          <tr>
            <td style="padding: 0 32px;">
              ${paymentDetailsHtml}
            </td>
          </tr>

          <!-- Order Items Breakdown -->
          <tr>
            <td style="padding: 10px 32px 24px 32px;">
              <div style="border-bottom: 2px solid #800020; padding-bottom: 10px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: baseline;">
                <h3 style="margin: 0; font-family: Georgia, serif; font-size: 16px; font-weight: 700; color: #800020; text-transform: uppercase; letter-spacing: 1px;">
                  Ordered Items (${data.items.length})
                </h3>
              </div>
              
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <thead>
                  <tr style="background: #FDFBF7; border-bottom: 1.5px solid #EADBCE; font-size: 11px; text-transform: uppercase; color: #78716C; letter-spacing: 1px;">
                    <th align="left" style="padding: 10px 12px 10px 0;">Item Details</th>
                    <th align="center" style="padding: 10px 8px;">Qty</th>
                    <th align="right" style="padding: 10px 0 10px 8px;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsRows}
                </tbody>
              </table>

              <!-- Totals Ledger -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top: 20px; border-top: 1.5px solid #EADBCE; padding-top: 14px;">
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #57534E;">Item Subtotal</td>
                  <td align="right" style="padding: 6px 0; font-size: 15px; font-weight: 700; color: #1C1917;">${formattedSubtotal}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #57534E;">Nationwide Insured Delivery</td>
                  <td align="right" style="padding: 6px 0;">
                    ${data.deliveryChargeMinor === 0 
                      ? '<span style="background: #ECFDF5; color: #059669; font-size: 12px; font-weight: 800; padding: 2px 10px; border-radius: 50px; border: 1px solid #A7F3D0;">FREE DELIVERY</span>' 
                      : `<span style="font-size: 15px; font-weight: 700; color: #1C1917;">${formattedDelivery}</span>`}
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding-top: 10px;">
                    <div style="background: linear-gradient(135deg, #800020 0%, #A31238 100%); border-radius: 12px; padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 14px rgba(128,0,32,0.2);">
                      <div>
                        <span style="display: block; font-size: 11px; text-transform: uppercase; color: #F5E6CC; letter-spacing: 1.5px; font-weight: 700;">Grand Total Payable</span>
                        <span style="font-size: 12px; color: #FFFFFF; opacity: 0.9;">(All taxes & handling included)</span>
                      </div>
                      <div style="text-align: right;">
                        <span style="font-family: Georgia, serif; font-size: 26px; font-weight: 800; color: #FFF3B0; letter-spacing: 0.5px;">${formattedTotal}</span>
                      </div>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Delivery Address Dossier -->
          <tr>
            <td style="padding: 0 32px 28px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #FAF7F2; border-radius: 14px; border: 1.5px solid #EADBCE; padding: 18px 22px;">
                <tr>
                  <td>
                    <div style="display: flex; align-items: center; margin-bottom: 8px;">
                      <span style="font-size: 12px; text-transform: uppercase; color: #800020; font-weight: 800; letter-spacing: 1px;">
                        📍 Delivery Destination
                      </span>
                    </div>
                    <p style="margin: 0; font-size: 14px; color: #292524; line-height: 1.6;">
                      <strong style="font-size: 15px; color: #1C1917;">${data.customerName}</strong><br />
                      ${data.addressLine1}${data.addressLine2 ? `, ${data.addressLine2}` : ''}<br />
                      <strong>${data.city}</strong>, ${data.province || 'Pakistan'}<br />
                      <strong style="color: #800020;">Contact Phone:</strong> ${data.customerPhone}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Vibrant Call-To-Action Buttons -->
          <tr>
            <td align="center" style="padding: 6px 32px 34px 32px; text-align: center;">
              <a href="${trackUrl}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #800020 0%, #B81D4E 100%); color: #FFFFFF; font-size: 14px; font-weight: 800; text-decoration: none; padding: 16px 32px; border-radius: 10px; margin: 6px; letter-spacing: 0.8px; box-shadow: 0 4px 16px rgba(184,29,78,0.35);">
                🔍 Track Order Live Online →
              </a>
              <a href="${whatsappUrl}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: #FFFFFF; font-size: 14px; font-weight: 800; text-decoration: none; padding: 16px 28px; border-radius: 10px; margin: 6px; letter-spacing: 0.5px; box-shadow: 0 4px 16px rgba(16,185,129,0.3);">
                💬 Chat on WhatsApp (0312-5880988)
              </a>
            </td>
          </tr>

          <!-- Trust & Heritage Guarantee Badges -->
          <tr>
            <td style="background-color: #FAF6F0; border-top: 1px solid #EADBCE; padding: 22px 24px; text-align: center;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="33%" align="center" style="padding: 6px;">
                    <span style="font-size: 18px; display: block; margin-bottom: 2px;">👑</span>
                    <strong style="font-size: 11px; color: #800020; text-transform: uppercase; letter-spacing: 0.5px; display: block;">100% Handcrafted</strong>
                    <span style="font-size: 10px; color: #78716C;">Master Lahore Artisans</span>
                  </td>
                  <td width="33%" align="center" style="padding: 6px; border-left: 1px solid #EADBCE; border-right: 1px solid #EADBCE;">
                    <span style="font-size: 18px; display: block; margin-bottom: 2px;">🎁</span>
                    <strong style="font-size: 11px; color: #800020; text-transform: uppercase; letter-spacing: 0.5px; display: block;">Velvet Heirloom Box</strong>
                    <span style="font-size: 10px; color: #78716C;">Royal Presentation</span>
                  </td>
                  <td width="33%" align="center" style="padding: 6px;">
                    <span style="font-size: 18px; display: block; margin-bottom: 2px;">🛡️</span>
                    <strong style="font-size: 11px; color: #800020; text-transform: uppercase; letter-spacing: 0.5px; display: block;">Insured Delivery</strong>
                    <span style="font-size: 10px; color: #78716C;">Doorstep Protection</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Royal Footer -->
          <tr>
            <td style="background: #1C1917; padding: 28px 30px; text-align: center; color: #A8A29E; font-size: 12px; line-height: 1.6;">
              <p style="margin: 0 0 6px 0; font-family: Georgia, serif; font-size: 16px; font-weight: 700; color: #FFF3B0; letter-spacing: 3px;">
                GULNAAR by MK
              </p>
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #D6D3D1;">
                Haute Jewellery & Handcrafted Heirlooms • Gulberg III, Lahore, Pakistan
              </p>
              <p style="margin: 0; font-size: 11px; color: #78716C;">
                Direct Concierge: 0312-5880988 • orders@gulnaarbymk.com<br />
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
 * 2. Website Owner (Gulnaar Admin) High-Impact New Order Alert Email
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
      <tr style="border-bottom: 1px solid #27272A;">
        <td style="padding: 12px 8px; color: #F5E6CC; font-weight: 700; font-size: 14px;">
          #${idx + 1}. ${it.name}
          <div style="font-size: 12px; color: #A1A1AA; font-weight: normal; margin-top: 2px;">
            ${it.size ? `<span style="background: #3F3F46; color: #F4F4F5; padding: 1px 6px; border-radius: 3px; margin-right: 4px;">Size: ${it.size}</span>` : ''}
            ${it.color ? `<span style="background: #3F3F46; color: #F4F4F5; padding: 1px 6px; border-radius: 3px; margin-right: 4px;">Color: ${it.color}</span>` : ''}
            <span>SKU: ${it.sku || 'GN-CUSTOM'}</span>
          </div>
        </td>
        <td align="center" style="padding: 12px 8px; font-size: 15px; font-weight: 800; color: #F59E0B;">
          × ${it.quantity}
        </td>
        <td align="right" style="padding: 12px 8px; font-size: 14px; font-weight: 800; color: #FFF3B0;">
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
  <title>🚨 NEW ORDER COMMISSIONED: #${data.orderNumber} — GULNAAR by MK</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0C0A09; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #FAFAF9; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding: 30px 10px; background-color: #0C0A09;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 620px; background-color: #18181B; border-radius: 18px; overflow: hidden; box-shadow: 0 16px 40px rgba(0,0,0,0.6); border: 2px solid #800020;">
          
          <!-- Urgent High-Alert Glowing Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #4A0318 0%, #800020 50%, #B81D4E 100%); padding: 32px 28px; border-bottom: 3px solid #D4AF37;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <span style="background-color: #FEF3C7; color: #92400E; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px; padding: 5px 12px; border-radius: 50px; border: 1px solid #FCD34D;">
                  🚨 NEW LIVE ORDER RECEIVED
                </span>
                <span style="font-family: monospace; font-size: 14px; color: #FFF3B0; font-weight: 700;">
                  #${data.orderNumber}
                </span>
              </div>
              <h1 style="margin: 0; color: #FFFFFF; font-size: 26px; font-weight: 800; letter-spacing: 0.5px;">
                Order ${data.orderNumber} Commissioned!
              </h1>
              <div style="margin-top: 10px; background: rgba(0,0,0,0.25); border-radius: 8px; padding: 8px 16px; display: inline-block;">
                <span style="color: #FDE68A; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Total Value:</span>
                <strong style="color: #FFF3B0; font-size: 24px; font-family: Georgia, serif; margin-left: 8px;">${formattedTotal}</strong>
              </div>
            </td>
          </tr>

          <!-- Quick Action Command Center (Top Priority Buttons) -->
          <tr>
            <td style="padding: 24px 28px; background: #27272A; border-bottom: 1px solid #3F3F46; text-align: center;">
              <p style="margin: 0 0 14px 0; font-size: 13px; color: #D4D4D8; font-weight: 600;">
                ⚡ Fast Order Actions (Tap below to execute immediately):
              </p>
              <div>
                <a href="${portalUrl}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #800020 0%, #B81D4E 100%); color: #FFFFFF; font-size: 13px; font-weight: 800; text-decoration: none; padding: 12px 20px; border-radius: 8px; margin: 4px; box-shadow: 0 2px 10px rgba(184,29,78,0.4);">
                  👉 Open Admin Portal
                </a>
                <a href="${customerWhatsApp}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: #FFFFFF; font-size: 13px; font-weight: 800; text-decoration: none; padding: 12px 18px; border-radius: 8px; margin: 4px; box-shadow: 0 2px 10px rgba(16,185,129,0.3);">
                  💬 1-Click WhatsApp
                </a>
                <a href="${callPhoneUrl}" target="_blank" style="display: inline-block; background: #3B82F6; color: #FFFFFF; font-size: 13px; font-weight: 800; text-decoration: none; padding: 12px 16px; border-radius: 8px; margin: 4px;">
                  📞 Call Customer
                </a>
              </div>
            </td>
          </tr>

          <!-- Customer Dossier & Dispatch Details -->
          <tr>
            <td style="padding: 26px 28px;">
              <h2 style="margin: 0 0 16px 0; font-size: 13px; text-transform: uppercase; color: #F59E0B; letter-spacing: 1.5px; font-weight: 800; border-bottom: 1px solid #27272A; padding-bottom: 8px;">
                📋 Customer & Shipping Dossier
              </h2>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size: 14px; line-height: 1.8;">
                <tr>
                  <td width="35%" style="color: #A1A1AA; padding: 4px 0;">Customer Name:</td>
                  <td style="color: #FFFFFF; font-weight: bold; font-size: 15px;">${data.customerName}</td>
                </tr>
                <tr>
                  <td style="color: #A1A1AA; padding: 4px 0;">Phone / WhatsApp:</td>
                  <td>
                    <strong style="color: #F43F5E; font-family: monospace; font-size: 15px;">${data.customerPhone}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="color: #A1A1AA; padding: 4px 0;">Customer Email:</td>
                  <td style="color: #E4E4E7;">${data.customerEmail || '<em style="color: #71717A;">Not provided</em>'}</td>
                </tr>
                <tr>
                  <td style="color: #A1A1AA; padding: 4px 0;">Destination City:</td>
                  <td><strong style="color: #FBBF24; font-size: 15px;">${data.city}</strong> (${data.province || 'Pakistan'})</td>
                </tr>
                <tr>
                  <td style="color: #A1A1AA; padding: 4px 0;">Full Address:</td>
                  <td style="color: #E4E4E7;">${data.addressLine1}${data.addressLine2 ? `, ${data.addressLine2}` : ''}</td>
                </tr>
                <tr>
                  <td style="color: #A1A1AA; padding: 4px 0;">Payment Method:</td>
                  <td>
                    <span style="background-color: #3F3F46; color: #FDE68A; padding: 3px 10px; border-radius: 6px; font-weight: 800; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px;">
                      ${data.paymentMethod}
                    </span>
                  </td>
                </tr>
                ${data.paymentReference ? `
                <tr>
                  <td style="color: #A1A1AA; padding: 4px 0;">TRX ID / Reference:</td>
                  <td><strong style="font-family: monospace; color: #34D399; font-size: 15px; background: #064E3B; padding: 2px 8px; border-radius: 4px;">${data.paymentReference}</strong></td>
                </tr>` : ''}
                ${data.specialInstructions ? `
                <tr>
                  <td style="color: #A1A1AA; padding: 4px 0;">Customer Notes:</td>
                  <td style="color: #FDE68A; font-style: italic; background: #27272A; padding: 6px 10px; border-radius: 6px;">${data.specialInstructions}</td>
                </tr>` : ''}
              </table>

              <!-- Order Packing List -->
              <div style="margin-top: 24px; padding-top: 18px; border-top: 1px solid #27272A;">
                <h3 style="margin: 0 0 12px 0; font-size: 13px; text-transform: uppercase; color: #F59E0B; letter-spacing: 1.5px; font-weight: 800;">
                  📦 Items Fulfillment & Packing List (${data.items.length} unique items)
                </h3>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #09090B; border-radius: 10px; border: 1px solid #27272A; overflow: hidden;">
                  ${itemsList}
                </table>
              </div>
            </td>
          </tr>

          <!-- Admin Footer -->
          <tr>
            <td style="background-color: #09090B; padding: 20px 28px; text-align: center; border-top: 1px solid #27272A; font-size: 11px; color: #71717A;">
              <p style="margin: 0;">
                GULNAAR by MK Real-Time Order Dispatch Engine • <a href="${portalUrl}" style="color: #F43F5E; font-weight: bold; text-decoration: none;">Launch Admin Portal</a>
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
 * 3. Customer Status Update Email (Triggered when Admin changes order status)
 */
export function generateCustomerStatusUpdateEmailHtml(data: SendStatusUpdateEmailParams): string {
  const trackUrl = `${SITE_URL}/track-order?ref=${data.orderNumber}`;
  const whatsappUrl = `https://wa.me/923125880988?text=Assalam-o-Alaikum%20Gulnaar%20Team!%20My%20order%20reference%20is%20${data.orderNumber}`;

  let statusTitle = '';
  let statusBadgeColor = '#800020';
  let statusBadgeBg = '#FFF1F5';
  let statusBorder = '#F472B6';
  let statusDesc = '';

  switch (data.status) {
    case 'confirmed':
      statusTitle = '✨ Order Verified & Confirmed';
      statusBadgeColor = '#065F46';
      statusBadgeBg = '#ECFDF5';
      statusBorder = '#10B981';
      statusDesc = 'Your order and payment have been officially verified. Our master artisans are now actively preparing your handcrafted jewellery set.';
      break;
    case 'processing':
      statusTitle = '💎 In Production & Velvet Gift Packing';
      statusBadgeColor = '#92400E';
      statusBadgeBg = '#FEF3C7';
      statusBorder = '#F59E0B';
      statusDesc = 'Your handcrafted jewellery is undergoing final master artisan inspection, polishing, and royal velvet gift presentation packaging.';
      break;
    case 'shipped':
      statusTitle = '🚚 Order Dispatched & In Transit';
      statusBadgeColor = '#1E40AF';
      statusBadgeBg = '#EFF6FF';
      statusBorder = '#3B82F6';
      statusDesc = `Your parcel has been dispatched with our express courier partner and is on its way to ${data.city}. Delivery is expected within 24 to 48 hours.`;
      break;
    case 'delivered':
      statusTitle = '🎉 Order Successfully Delivered';
      statusBadgeColor = '#065F46';
      statusBadgeBg = '#ECFDF5';
      statusBorder = '#10B981';
      statusDesc = 'Your parcel has reached its destination. We truly hope you cherish your GULNAAR by MK heirloom jewellery for years to come!';
      break;
    case 'cancelled':
      statusTitle = 'Order Cancelled';
      statusBadgeColor = '#991B1B';
      statusBadgeBg = '#FEF2F2';
      statusBorder = '#EF4444';
      statusDesc = 'Your order has been cancelled upon request. If this was unexpected, please contact Gulnaar Support on WhatsApp.';
      break;
    default:
      statusTitle = 'Order Status Update';
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
<body style="margin: 0; padding: 0; background-color: #F7F3EB; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #292524; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #F7F3EB; padding: 36px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 620px; background-color: #FFFFFF; border-radius: 20px; overflow: hidden; box-shadow: 0 16px 48px rgba(128, 0, 32, 0.12); border: 2px solid #EADBCE;">
          
          <!-- Top Accent Gold Line -->
          <tr>
            <td style="height: 6px; background: linear-gradient(90deg, #D4AF37 0%, #FFF3B0 25%, #E5A93C 50%, #FFF3B0 75%, #D4AF37 100%);"></td>
          </tr>

          <!-- Brand Header -->
          <tr>
            <td align="center" style="background: linear-gradient(135deg, #3A0211 0%, #68051E 40%, #800020 75%, #A31238 100%); padding: 36px 24px 30px; text-align: center; border-bottom: 2px solid #D4AF37;">
              <h1 style="margin: 0; font-family: Georgia, serif; font-size: 32px; font-weight: 700; color: #FFFFFF; letter-spacing: 6px; text-transform: uppercase;">
                G U L N A A R
              </h1>
              <p style="margin: 6px 0 0; font-size: 10px; color: #F5E6CC; text-transform: uppercase; letter-spacing: 3px; font-weight: 700;">
                BY MK • ORDER STATUS NOTIFICATION
              </p>
            </td>
          </tr>

          <!-- Status Hero -->
          <tr>
            <td style="padding: 40px 32px 28px 32px; text-align: center;">
              <div style="display: inline-block; background: ${statusBadgeBg}; border: 1.5px solid ${statusBorder}; border-radius: 50px; padding: 8px 24px; margin-bottom: 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
                <span style="color: ${statusBadgeColor}; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">
                  ${statusTitle}
                </span>
              </div>
              <h2 style="margin: 0 0 10px 0; font-family: Georgia, serif; font-size: 24px; font-weight: 700; color: #1C1917;">
                Order #${data.orderNumber}
              </h2>
              <p style="margin: 0 0 20px 0; font-size: 15px; color: #57534E; line-height: 1.6; max-width: 480px; margin-left: auto; margin-right: auto;">
                ${statusDesc}
              </p>
              
              <!-- Order Info Card -->
              <div style="background-color: #FAF7F2; border: 1.5px solid #EADBCE; border-radius: 12px; padding: 16px 24px; display: inline-block; text-align: left; margin: 8px 0 16px 0;">
                <span style="font-size: 13px; color: #57534E;">Customer: <strong style="color: #1C1917;">${data.customerName}</strong></span><br />
                <span style="font-size: 13px; color: #57534E;">Destination City: <strong style="color: #1C1917;">${data.city}</strong></span><br />
                <span style="font-size: 13px; color: #57534E;">Order Total: <strong style="color: #800020; font-size: 15px;">${formatPkr(data.totalMinor)}</strong></span>
              </div>
            </td>
          </tr>

          <!-- Action Buttons -->
          <tr>
            <td align="center" style="padding: 10px 32px 36px 32px; text-align: center;">
              <a href="${trackUrl}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #800020 0%, #B81D4E 100%); color: #FFFFFF; font-size: 14px; font-weight: 800; text-decoration: none; padding: 15px 30px; border-radius: 10px; margin: 6px; letter-spacing: 0.5px; box-shadow: 0 4px 16px rgba(184,29,78,0.35);">
                🔍 Track Live Progress Online →
              </a>
              <a href="${whatsappUrl}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: #FFFFFF; font-size: 14px; font-weight: 800; text-decoration: none; padding: 15px 26px; border-radius: 10px; margin: 6px; letter-spacing: 0.5px; box-shadow: 0 4px 16px rgba(16,185,129,0.3);">
                💬 Contact WhatsApp Concierge
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #1C1917; padding: 24px 30px; text-align: center; color: #A8A29E; font-size: 12px; line-height: 1.6;">
              <p style="margin: 0 0 6px 0; font-family: Georgia, serif; font-size: 15px; font-weight: 700; color: #FFF3B0; letter-spacing: 2px;">
                GULNAAR by MK
              </p>
              <p style="margin: 0; font-size: 11px; color: #78716C;">
                Haute Jewellery & Handcrafted Heirlooms • Gulberg III, Lahore, Pakistan<br />
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
