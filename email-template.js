/**
 * Email Templates for Bhakti Construction
 * ----------------------------------------
 * Luxury themed responsive HTML & plain text email generators
 * for Admin Lead Notifications and Customer Confirmations.
 */

const path = require('path');

// Icon map for construction services
const SERVICE_ICONS = {
  'Building Construction': '🏢',
  'Renovation': '🔨',
  'Civil Works': '🏗️',
  'Farm Land Development': '🌱',
  'Manpower Supply': '👷',
  'Heavy Machinery Hiring': '🚜',
  'Other': '📋',
};

const SOURCE_LABELS = {
  'hero-quick-form': 'Hero Quick Form (Instant Call Back)',
  'contact-form': 'Main Contact Page Form',
};

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatISTDate(isoString) {
  try {
    const d = new Date(isoString || Date.now());
    return d.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }) + ' IST';
  } catch {
    return String(isoString || '');
  }
}

function formatPhoneDisplay(raw) {
  const digits = String(raw || '').replace(/\D/g, '');
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  if (digits.length > 10 && digits.startsWith('91')) {
    const last10 = digits.slice(-10);
    return `+91 ${last10.slice(0, 5)} ${last10.slice(5)}`;
  }
  return raw || 'N/A';
}

function getPhoneDigits(raw) {
  return String(raw || '').replace(/\D/g, '').slice(-10);
}

/**
 * Generate Admin / Team Lead Notification Email
 * @param {Object} entry - Enquiry data
 * @param {Object} [options] - Optional configs (adminUrl, logoSrc)
 */
function renderAdminEnquiryEmail(entry, options = {}) {
  const logoSrc = options.logoSrc || 'cid:bhakti-logo';
  const adminUrl = options.adminUrl || 'http://localhost:3000/admin';
  const phoneDigits = getPhoneDigits(entry.phone);
  const formattedPhone = formatPhoneDisplay(entry.phone);
  const formattedDate = formatISTDate(entry.createdAt);
  const serviceIcon = SERVICE_ICONS[entry.service] || '🏗️';
  const sourceName = SOURCE_LABELS[entry.source] || entry.source || 'Website Form';
  const refId = `BC-${(entry.id || '').slice(0, 8).toUpperCase()}`;

  const hasEmail = Boolean(entry.email && entry.email.trim());
  const hasLocation = Boolean(entry.location && entry.location.trim());
  const hasBudget = Boolean(entry.budget && entry.budget.trim());
  const hasMessage = Boolean(entry.message && entry.message.trim());

  const subject = `⚡ New Lead [${entry.service}]: ${entry.name} (${formattedPhone})`;

  const text = `
======================================================
  BHAKTI CONSTRUCTION — NEW ENQUIRY NOTIFICATION
======================================================

Ref ID: ${refId}
Received On: ${formattedDate}
Source: ${sourceName}

--- CLIENT INFORMATION ---
Name:    ${entry.name}
Phone:   ${formattedPhone} (Call: tel:+91${phoneDigits} | WhatsApp: https://wa.me/91${phoneDigits})
Email:   ${hasEmail ? entry.email : 'Not provided'}

--- PROJECT DETAILS ---
Service:  ${serviceIcon} ${entry.service}
Location: ${hasLocation ? entry.location : 'Not specified'}
Budget:   ${hasBudget ? entry.budget : 'Not specified'}

--- CLIENT MESSAGE / REQUIREMENTS ---
${hasMessage ? entry.message : '(Quick call back requested via Hero Form)'}

--- ACTIONS ---
• Call: +91${phoneDigits}
• WhatsApp: https://wa.me/91${phoneDigits}
${hasEmail ? `• Reply Email: mailto:${entry.email}\n` : ''}• View Admin Dashboard: ${adminUrl}

======================================================
Bhakti Construction
Bijipur, Tamando, Bhubaneswar, Odisha – 751019
Helpline: +91 77354 46710 | bhakticonstructions98@gmail.com
======================================================
`.trim();

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Enquiry Notification</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td, a, span { font-family: Arial, sans-serif !important; }
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f3f3f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1f2024; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%;">

  <!-- Preheader text (shows in email inbox snippet) -->
  <div style="display: none; font-size: 1px; color: #f3f3f0; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    New ${escapeHtml(entry.service)} enquiry from ${escapeHtml(entry.name)} (${formattedPhone}). Location: ${escapeHtml(entry.location || 'Bhubaneswar')}.
  </div>

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f3f3f0; padding: 24px 12px;">
    <tr>
      <td align="center">

        <!-- Main Card Container (max-width: 600px) -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e3dc; box-shadow: 0 12px 36px rgba(11, 11, 13, 0.08);">
          
          <!-- Top Gold Accent Line -->
          <tr>
            <td style="height: 5px; background: linear-gradient(90deg, #9a7630 0%, #c9a24d 50%, #f1d894 100%);"></td>
          </tr>

          <!-- Luxury Header -->
          <tr>
            <td style="background-color: #0b0b0d; padding: 28px 24px 22px; text-align: center;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <img src="${logoSrc}" alt="Bhakti Construction" width="60" height="60" style="display: block; border-radius: 50%; border: 2px solid #c9a24d; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.4);" />
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 12px;">
                    <div style="font-family: Georgia, 'Times New Roman', serif; font-size: 23px; font-weight: 700; letter-spacing: 3px; color: #ffffff; line-height: 1.2;">
                      BHAKTI <span style="color: #c9a24d;">CONSTRUCTION</span>
                    </div>
                    <div style="font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #e9cf8a; font-weight: 600; margin-top: 4px;">
                      Complete Civil Construction Solution &bull; Bhubaneswar
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 14px;">
                    <span style="display: inline-block; background-color: rgba(201, 162, 77, 0.18); border: 1px solid #c9a24d; border-radius: 50px; padding: 6px 16px; color: #f1d894; font-size: 11px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase;">
                      ⚡ NEW WEBSITE LEAD RECEIVED
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Client Highlight Hero Banner -->
          <tr>
            <td style="background: #faf8f2; border-bottom: 1px solid #ede8dc; padding: 22px 24px; text-align: center;">
              <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.4px; color: #8a7c64; font-weight: 600;">
                Client Name
              </div>
              <div style="font-size: 24px; font-weight: 800; color: #0b0b0d; margin-top: 4px; line-height: 1.2;">
                ${escapeHtml(entry.name)}
              </div>
              <div style="margin-top: 10px;">
                <span style="display: inline-block; background-color: #0b0b0d; color: #f1d894; font-size: 13px; font-weight: 600; padding: 6px 14px; border-radius: 20px; border: 1px solid #c9a24d;">
                  ${serviceIcon} ${escapeHtml(entry.service)}
                </span>
              </div>
              <div style="font-size: 12px; color: #7a7a85; margin-top: 10px;">
                📅 Received: <strong style="color: #333;">${formattedDate}</strong>
              </div>
            </td>
          </tr>

          <!-- Immediate Quick Action CTAs -->
          <tr>
            <td style="padding: 20px 24px 10px; background-color: #ffffff;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <!-- Call Button -->
                    <a href="tel:+91${phoneDigits}" style="display: inline-block; background: linear-gradient(135deg, #f1d894 0%, #c9a24d 50%, #9a7630 100%); color: #0b0b0d; font-size: 13.5px; font-weight: 700; text-decoration: none; padding: 11px 20px; border-radius: 50px; margin: 4px; box-shadow: 0 4px 12px rgba(201, 162, 77, 0.35); text-align: center;">
                      📞 Call ${formattedPhone}
                    </a>
                    
                    <!-- WhatsApp Button -->
                    <a href="https://wa.me/91${phoneDigits}?text=Hello%20${encodeURIComponent(entry.name)}%2C%20thank%20you%20for%20contacting%20Bhakti%20Construction%20regarding%20${encodeURIComponent(entry.service)}." target="_blank" style="display: inline-block; background: linear-gradient(135deg, #2bd46d 0%, #138a45 100%); color: #ffffff; font-size: 13.5px; font-weight: 700; text-decoration: none; padding: 11px 20px; border-radius: 50px; margin: 4px; box-shadow: 0 4px 12px rgba(31, 170, 89, 0.35); text-align: center;">
                      💬 WhatsApp Client
                    </a>

                    ${hasEmail ? `
                    <!-- Email Button -->
                    <a href="mailto:${escapeHtml(entry.email)}?subject=Re:%20Bhakti%20Construction%20Enquiry%20-%20${encodeURIComponent(entry.service)}" style="display: inline-block; background: #1b1b22; color: #f1d894; font-size: 13.5px; font-weight: 600; text-decoration: none; padding: 11px 20px; border-radius: 50px; margin: 4px; border: 1px solid #c9a24d; text-align: center;">
                      ✉️ Reply Email
                    </a>
                    ` : ''}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Lead Details Table -->
          <tr>
            <td style="padding: 14px 24px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; background-color: #faf9f6; border-radius: 12px; overflow: hidden; border: 1px solid #e8e5db;">
                
                <!-- Section Title -->
                <tr>
                  <td colspan="2" style="background-color: #141418; color: #f1d894; padding: 10px 16px; font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">
                    📋 Complete Lead Details
                  </td>
                </tr>

                <!-- Client Name -->
                <tr style="border-bottom: 1px solid #ece8de;">
                  <td width="35%" style="padding: 11px 16px; font-size: 13px; color: #6e6f77; font-weight: 600;">
                    👤 Client Name
                  </td>
                  <td style="padding: 11px 16px; font-size: 14px; color: #0b0b0d; font-weight: 700;">
                    ${escapeHtml(entry.name)}
                  </td>
                </tr>

                <!-- Phone -->
                <tr style="border-bottom: 1px solid #ece8de; background-color: #ffffff;">
                  <td style="padding: 11px 16px; font-size: 13px; color: #6e6f77; font-weight: 600;">
                    📱 Mobile Number
                  </td>
                  <td style="padding: 11px 16px; font-size: 14px; font-weight: 700;">
                    <a href="tel:+91${phoneDigits}" style="color: #9a7630; text-decoration: none;">
                      ${formattedPhone}
                    </a>
                  </td>
                </tr>

                <!-- Email -->
                <tr style="border-bottom: 1px solid #ece8de;">
                  <td style="padding: 11px 16px; font-size: 13px; color: #6e6f77; font-weight: 600;">
                    ✉️ Email Address
                  </td>
                  <td style="padding: 11px 16px; font-size: 13.5px; color: #1c1d22;">
                    ${hasEmail 
                      ? `<a href="mailto:${escapeHtml(entry.email)}" style="color: #1b5cb8; text-decoration: underline;">${escapeHtml(entry.email)}</a>` 
                      : '<span style="color: #95969e; font-style: italic;">Not provided</span>'}
                  </td>
                </tr>

                <!-- Service -->
                <tr style="border-bottom: 1px solid #ece8de; background-color: #ffffff;">
                  <td style="padding: 11px 16px; font-size: 13px; color: #6e6f77; font-weight: 600;">
                    🏗️ Service Requested
                  </td>
                  <td style="padding: 11px 16px; font-size: 14px; color: #0b0b0d; font-weight: 700;">
                    ${serviceIcon} ${escapeHtml(entry.service)}
                  </td>
                </tr>

                <!-- Location -->
                <tr style="border-bottom: 1px solid #ece8de;">
                  <td style="padding: 11px 16px; font-size: 13px; color: #6e6f77; font-weight: 600;">
                    📍 Site Location
                  </td>
                  <td style="padding: 11px 16px; font-size: 13.5px; color: #1c1d22; font-weight: 600;">
                    ${hasLocation ? `📍 ${escapeHtml(entry.location)}` : '<span style="color: #95969e; font-style: italic;">Not specified</span>'}
                  </td>
                </tr>

                <!-- Budget -->
                <tr style="border-bottom: 1px solid #ece8de; background-color: #ffffff;">
                  <td style="padding: 11px 16px; font-size: 13px; color: #6e6f77; font-weight: 600;">
                    💰 Approx. Budget
                  </td>
                  <td style="padding: 11px 16px; font-size: 13.5px; color: #1c1d22; font-weight: 600;">
                    ${hasBudget ? `💵 ${escapeHtml(entry.budget)}` : '<span style="color: #95969e; font-style: italic;">Not specified</span>'}
                  </td>
                </tr>

                <!-- Source & Reference -->
                <tr style="border-bottom: 1px solid #ece8de;">
                  <td style="padding: 11px 16px; font-size: 13px; color: #6e6f77; font-weight: 600;">
                    🌐 Lead Source
                  </td>
                  <td style="padding: 11px 16px; font-size: 12.5px; color: #555761;">
                    <span style="display: inline-block; background-color: #eae7dd; color: #3b3a36; padding: 2px 8px; border-radius: 4px; font-weight: 600;">
                      ${escapeHtml(sourceName)}
                    </span>
                  </td>
                </tr>

                <!-- Reference ID -->
                <tr style="background-color: #ffffff;">
                  <td style="padding: 11px 16px; font-size: 13px; color: #6e6f77; font-weight: 600;">
                    🔖 Lead Ref ID
                  </td>
                  <td style="padding: 11px 16px; font-size: 12px; font-family: monospace; color: #727480;">
                    ${escapeHtml(refId)}
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Project Details / Message Box -->
          <tr>
            <td style="padding: 0 24px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fbf9f4; border-left: 4px solid #c9a24d; border-radius: 0 10px 10px 0; border-top: 1px solid #ece6d8; border-right: 1px solid #ece6d8; border-bottom: 1px solid #ece6d8;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #9a7630; font-weight: 700; margin-bottom: 6px;">
                      💬 Client Message / Project Notes
                    </div>
                    <div style="font-size: 14px; line-height: 1.6; color: #2c2d33;">
                      ${hasMessage 
                        ? escapeHtml(entry.message).replace(/\n/g, '<br>') 
                        : '<span style="color: #7a7a85; font-style: italic;">⚡ Quick call back requested via Hero Form (no additional message entered).</span>'}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Admin Portal Link & Follow-up Tip -->
          <tr>
            <td style="padding: 0 24px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f7f6f2; border-radius: 12px; padding: 16px; border: 1px dashed #d6d2c4;">
                <tr>
                  <td>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="vertical-align: middle;">
                          <div style="font-size: 13px; font-weight: 700; color: #0b0b0d;">
                            💡 Fast Response Tip:
                          </div>
                          <div style="font-size: 12px; color: #61626c; margin-top: 2px;">
                            Calling back within 15 minutes increases enquiry conversion rates by up to 300%.
                          </div>
                        </td>
                        <td align="right" style="vertical-align: middle; padding-left: 12px;">
                          <a href="${adminUrl}" target="_blank" style="display: inline-block; background-color: #141418; color: #f1d894; font-size: 12px; font-weight: 600; text-decoration: none; padding: 8px 16px; border-radius: 6px; white-space: nowrap; border: 1px solid #c9a24d;">
                            Admin Panel →
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0b0b0d; color: #b7b3a7; padding: 24px 24px 20px; text-align: center; border-top: 1px solid #23232b;">
              <div style="font-family: Georgia, 'Times New Roman', serif; font-size: 16px; font-weight: 700; color: #f1d894; letter-spacing: 1.5px;">
                BHAKTI CONSTRUCTION
              </div>
              <div style="font-size: 11.5px; color: #9a968a; margin-top: 4px; line-height: 1.5;">
                PLOT NO. 291/1014/2755, Bijipur, Tamando, Bhubaneswar, Odisha – 751019<br>
                📞 <a href="tel:+917735446710" style="color: #e9cf8a; text-decoration: none;">+91 77354 46710</a> &bull; 
                💬 <a href="https://wa.me/917735446710" style="color: #e9cf8a; text-decoration: none;">WhatsApp: 7735446710</a> &bull; 
                📧 <a href="mailto:bhakticonstructions98@gmail.com" style="color: #e9cf8a; text-decoration: none;">bhakticonstructions98@gmail.com</a>
              </div>
              <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid #1c1c24; font-size: 11px; color: #67655f;">
                This is an automated notification from the Bhakti Construction website enquiry system.
              </div>
            </td>
          </tr>

        </table>
        <!-- End Main Card -->

      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html, text };
}

/**
 * Generate Customer Acknowledgment / Thank You Email
 * Sent to the customer if they provided their email address.
 * @param {Object} entry - Enquiry data
 * @param {Object} [options] - Optional configs (logoSrc)
 */
function renderCustomerConfirmationEmail(entry, options = {}) {
  const logoSrc = options.logoSrc || 'cid:bhakti-logo';
  const firstName = (entry.name || '').trim().split(' ')[0] || 'Valued Client';
  const formattedPhone = formatPhoneDisplay(entry.phone);
  const formattedDate = formatISTDate(entry.createdAt);
  const serviceIcon = SERVICE_ICONS[entry.service] || '🏗️';
  const refId = `BC-${(entry.id || '').slice(0, 8).toUpperCase()}`;

  const hasLocation = Boolean(entry.location && entry.location.trim());
  const hasBudget = Boolean(entry.budget && entry.budget.trim());
  const hasMessage = Boolean(entry.message && entry.message.trim());

  const subject = `Enquiry Received: ${entry.service} – Bhakti Construction`;

  const text = `
======================================================
  BHAKTI CONSTRUCTION — ENQUIRY CONFIRMATION
======================================================

Dear ${firstName},

Thank you for contacting Bhakti Construction! We have received your enquiry for ${entry.service}.

Our senior project consultant is reviewing your requirements and will call you shortly at ${formattedPhone} to discuss your project and provide a transparent quotation.

--- SUMMARY OF YOUR ENQUIRY ---
• Reference ID:  ${refId}
• Service:       ${serviceIcon} ${entry.service}
• Site Location: ${hasLocation ? entry.location : 'As discussed'}
• Budget:        ${hasBudget ? entry.budget : 'Flexible / To be discussed'}
• Date:          ${formattedDate}
${hasMessage ? `• Your Note:     ${entry.message}\n` : ''}
--- NEED IMMEDIATE ASSISTANCE? ---
You can reach our helpline directly anytime:
• Phone:    +91 77354 46710 (tel:+917735446710)
• WhatsApp: +91 77354 46710 (https://wa.me/917735446710)
• Email:    bhakticonstructions98@gmail.com

--- WHY BHAKTI CONSTRUCTION ---
✓ 150+ Projects Successfully Completed
✓ 10+ Years of Construction Excellence
✓ 200+ Skilled Workers & Experienced Engineers
✓ 100% Quality Assured Materials & On-Time Delivery

Warm regards,
The Bhakti Construction Team
Bijipur, Tamando, Bhubaneswar, Odisha – 751019
Website: https://bhakticonstruction.in
======================================================
`.trim();

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You for Your Enquiry</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f3f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1f2024; -webkit-font-smoothing: antialiased;">

  <!-- Preheader text -->
  <div style="display: none; font-size: 1px; color: #f3f3f0; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    Dear ${escapeHtml(firstName)}, we have received your enquiry for ${escapeHtml(entry.service)}. Our engineer will get in touch shortly.
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f3f3f0; padding: 24px 12px;">
    <tr>
      <td align="center">

        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e3dc; box-shadow: 0 12px 36px rgba(11, 11, 13, 0.08);">
          
          <!-- Top Gold Accent Line -->
          <tr>
            <td style="height: 5px; background: linear-gradient(90deg, #9a7630 0%, #c9a24d 50%, #f1d894 100%);"></td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="background-color: #0b0b0d; padding: 28px 24px 22px; text-align: center;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <img src="${logoSrc}" alt="Bhakti Construction" width="60" height="60" style="display: block; border-radius: 50%; border: 2px solid #c9a24d; background-color: #ffffff;" />
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 12px;">
                    <div style="font-family: Georgia, 'Times New Roman', serif; font-size: 23px; font-weight: 700; letter-spacing: 3px; color: #ffffff;">
                      BHAKTI <span style="color: #c9a24d;">CONSTRUCTION</span>
                    </div>
                    <div style="font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #e9cf8a; font-weight: 600; margin-top: 4px;">
                      Complete Civil Construction Solution &bull; Bhubaneswar
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Greeting Body -->
          <tr>
            <td style="padding: 28px 28px 20px;">
              <div style="font-size: 18px; font-weight: 700; color: #0b0b0d;">
                Hello ${escapeHtml(firstName)},
              </div>
              <p style="font-size: 14.5px; line-height: 1.7; color: #3a3b45; margin-top: 10px;">
                Thank you for contacting <strong>Bhakti Construction</strong>. We have successfully received your enquiry regarding <strong>${escapeHtml(entry.service)}</strong>.
              </p>
              <p style="font-size: 14.5px; line-height: 1.7; color: #3a3b45; margin-top: 8px;">
                Our project engineer will review your requirements and call you at <strong>${formattedPhone}</strong> shortly to discuss the details and provide a tailored estimate.
              </p>

              <!-- Highlight summary card -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #faf9f6; border-radius: 12px; border: 1px solid #e7e4dc; margin: 20px 0 16px; overflow: hidden;">
                <tr>
                  <td colspan="2" style="background-color: #f2eee3; padding: 10px 16px; font-size: 12px; font-weight: 700; color: #735921; text-transform: uppercase; letter-spacing: 1px;">
                    📌 Your Enquiry Summary (Ref: ${escapeHtml(refId)})
                  </td>
                </tr>
                <tr style="border-bottom: 1px solid #ece8de;">
                  <td width="38%" style="padding: 10px 16px; font-size: 13px; color: #6e6f77; font-weight: 600;">Service</td>
                  <td style="padding: 10px 16px; font-size: 13.5px; color: #0b0b0d; font-weight: 700;">${serviceIcon} ${escapeHtml(entry.service)}</td>
                </tr>
                <tr style="border-bottom: 1px solid #ece8de; background-color: #ffffff;">
                  <td style="padding: 10px 16px; font-size: 13px; color: #6e6f77; font-weight: 600;">Site Location</td>
                  <td style="padding: 10px 16px; font-size: 13.5px; color: #1c1d22;">${hasLocation ? escapeHtml(entry.location) : 'To be discussed'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #ece8de;">
                  <td style="padding: 10px 16px; font-size: 13px; color: #6e6f77; font-weight: 600;">Approx. Budget</td>
                  <td style="padding: 10px 16px; font-size: 13.5px; color: #1c1d22;">${hasBudget ? escapeHtml(entry.budget) : 'Flexible'}</td>
                </tr>
                ${hasMessage ? `
                <tr style="background-color: #ffffff;">
                  <td style="padding: 10px 16px; font-size: 13px; color: #6e6f77; font-weight: 600; vertical-align: top;">Your Note</td>
                  <td style="padding: 10px 16px; font-size: 13px; color: #333; line-height: 1.5;">${escapeHtml(entry.message).replace(/\n/g, '<br>')}</td>
                </tr>
                ` : ''}
              </table>

              <!-- Trust Pillars -->
              <div style="background-color: #0b0b0d; border-radius: 12px; padding: 16px; color: #ffffff; margin-top: 22px;">
                <div style="font-size: 12px; font-weight: 700; color: #c9a24d; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
                  ⭐ Why Choose Bhakti Construction:
                </div>
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 12.5px; color: #e5e3db; line-height: 1.6;">
                  <tr>
                    <td width="50%" style="padding: 4px 6px 4px 0;">✔ <strong>150+</strong> Projects Completed</td>
                    <td width="50%" style="padding: 4px 0;">✔ <strong>10+</strong> Years of Excellence</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 6px 4px 0;">✔ <strong>200+</strong> Skilled Workforce</td>
                    <td style="padding: 4px 0;">✔ <strong>100%</strong> Quality Assured Materials</td>
                  </tr>
                </table>
              </div>

              <!-- Urgent Contact CTA -->
              <div style="text-align: center; margin-top: 24px; padding-top: 18px; border-top: 1px solid #eee;">
                <div style="font-size: 13px; color: #6e6f77; margin-bottom: 12px;">
                  Need an urgent site visit or quotation? Connect with us directly:
                </div>
                <div>
                  <a href="tel:+917735446710" style="display: inline-block; background: linear-gradient(135deg, #f1d894 0%, #c9a24d 50%, #9a7630 100%); color: #0b0b0d; font-size: 13px; font-weight: 700; text-decoration: none; padding: 10px 20px; border-radius: 50px; margin: 4px;">
                    📞 Call +91 77354 46710
                  </a>
                  <a href="https://wa.me/917735446710?text=Hello%20Bhakti%20Construction%2C%20I%20just%20submitted%20an%20enquiry." target="_blank" style="display: inline-block; background: #1faa59; color: #ffffff; font-size: 13px; font-weight: 700; text-decoration: none; padding: 10px 20px; border-radius: 50px; margin: 4px;">
                    💬 WhatsApp Us
                  </a>
                </div>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0b0b0d; color: #b7b3a7; padding: 22px 24px; text-align: center; border-top: 1px solid #23232b;">
              <div style="font-family: Georgia, 'Times New Roman', serif; font-size: 15px; font-weight: 700; color: #f1d894; letter-spacing: 1.5px;">
                BHAKTI CONSTRUCTION
              </div>
              <div style="font-size: 11.5px; color: #9a968a; margin-top: 4px; line-height: 1.5;">
                PLOT NO. 291/1014/2755, Bijipur, Tamando, Bhubaneswar, Odisha – 751019<br>
                Helpline: +91 77354 46710 &bull; Email: bhakticonstructions98@gmail.com
              </div>
              <div style="margin-top: 12px; font-size: 11px; color: #67655f;">
                &copy; ${new Date().getFullYear()} Bhakti Construction. All Rights Reserved.
              </div>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html, text };
}

module.exports = {
  renderAdminEnquiryEmail,
  renderCustomerConfirmationEmail,
  SERVICE_ICONS,
  formatISTDate,
  formatPhoneDisplay,
  getPhoneDigits,
};
